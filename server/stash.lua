function RegisterStashCallbacks()
	Callbacks:RegisterServerCallback("Stash:Server:Open", function(source, data, cb)
		if GlobalState[string.format("%s:Property", source)] ~= nil then
			local pid = GlobalState[string.format("%s:Property", source)]
			if not _openInvs[string.format("%s-%s", 13, pid)] then
				Inventory.Stash:Open(source, 13, pid)
				cb({ type = 13, owner = string.format("stash:%s", pid) })
			else
				cb(nil)
			end
		else
			cb(nil)
		end
	end)

	Callbacks:RegisterServerCallback("Shop:Server:Open", function(source, data, cb)
		local k = string.format("shop:%s", data.identifier)
		if shopLocations[k] ~= nil then
			local entId = shopLocations[k].entityId
			if not _openInvs[string.format("%s-%s", entId, data.identifier)] then
				Inventory:OpenSecondary(source, entId, ("shop:%s"):format(data.identifier))
				cb(entId)
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)

	Callbacks:RegisterServerCallback("Shop:Server:Purchase", function(source, data, cb)
		local player = Fetch:Source(source)
		if not player then
			cb(false)
			return
		end

		local char = player:GetData("Character")
		if not char then
			cb(false)
			return
		end

		local shopData = shopLocations[data.shopOwner]
		local entityType = data.shopInvType and LoadedEntitys[tonumber(data.shopInvType)] or nil
		local isPolyShop = (not shopData and entityType and entityType.shop)

		if not shopData and not isPolyShop then
			Execute:Client(source, "Notification", "Error", "Invalid Shop")
			cb(false)
			return
		end

		local isFreeShop = (entityType and entityType.free) or false

		if not isFreeShop then
			local calculatedTotal = 0
			for _, item in ipairs(data.items) do
				local itemDef = itemsDatabase[item.itemName]
				if itemDef and itemDef.price then
					calculatedTotal = calculatedTotal + (itemDef.price * item.quantity)
				end
			end

			if math.abs(calculatedTotal - data.totalPrice) > 0.01 then
				Execute:Client(source, "Notification", "Error", "Price Mismatch")
				cb(false)
				return
			end

			-- Process payment
			local paid = false
			if data.paymentMethod == 'cash' then
				paid = Wallet:Modify(source, -(math.abs(data.totalPrice)))
			elseif data.paymentMethod == 'bank' then
				paid = Banking.Balance:Charge(char:GetData("BankAccount"), data.totalPrice, {
					type = 'bill',
					title = 'Shop Purchase',
					description = string.format('Shop purchase for $%s', data.totalPrice),
					data = {}
				})
			end

			if not paid then
				Execute:Client(source, "Notification", "Error", "Insufficient Funds")
				cb(false)
				return
			end
		end

		-- Add items to player inventory using shop purchase flow
		local allSuccess = true
		for _, cartItem in ipairs(data.items) do
			local itemDef = itemsDatabase[cartItem.itemName]
			if not itemDef then
				allSuccess = false
				Execute:Client(source, "Notification", "Error", string.format("Invalid Item: %s", cartItem.itemName))
			else
				-- Find an empty slot for this item
				local slots = Inventory:GetFreeSlotNumbers(char:GetData("SID"), 1, false, false)
				if #slots > 0 and slots[1] <= 40 then
					local targetSlot = slots[1]

					-- Create the item using the same method as DoMove for shop purchases
					local insData = Inventory:CreateItem(char:GetData("SID"), cartItem.itemName, cartItem.quantity, targetSlot, {}, 1, false)

					if insData then
						CreateStoreLog(data.shopOwner, cartItem.itemName, cartItem.quantity, char:GetData("SID"), insData.metadata, insData.id)
						LogEvent(source, 'Info', string.format('SID: %s, Brought x%s %s from %s for $%s (Cart Purchase)',
							char:GetData("SID"),
							cartItem.quantity,
							cartItem.itemName,
							data.shopOwner,
							cartItem.unitPrice * cartItem.quantity
						))
					else
						allSuccess = false
						Execute:Client(source, "Notification", "Error", string.format("Failed to add %s", itemDef.label or cartItem.itemName))
					end
				else
					allSuccess = false
					Execute:Client(source, "Notification", "Error", "Not enough inventory space")
				end
			end
		end

		if allSuccess then
			Execute:Client(source, "Notification", "Success", string.format("Purchase Complete: $%s", data.totalPrice))
			-- Refresh the entire player inventory to show newly purchased items
			refreshShit(char:GetData("SID"), true)
		end

		cb(allSuccess)
	end)

	Callbacks:RegisterServerCallback("Inventory:Server:Open", function(source, data, cb)
		if not _openInvs[string.format("%s-%s", data.invType, data.owner)] then
			if entityPermCheck(source, data.invType) then
				Inventory:OpenSecondary(source, data.invType, data.owner, data.class or false, data.model or false)
				cb(true)
			else
				cb(false)
			end
		else
			cb(false)
		end
	end)
end
