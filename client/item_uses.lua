local _energyCd = false

AddEventHandler("ItemUses:Shared:DependencyUpdate", RetrieveItemUsesComponents)
function RetrieveItemUsesComponents()
	Animations = exports["mythic-base"]:FetchComponent("Animations")
	Sounds = exports["mythic-base"]:FetchComponent("Sounds")
end

AddEventHandler("Core:Shared:Ready", function()
	exports["mythic-base"]:RequestDependencies("ItemUses", {
		"Animations",
		"Sounds",
	}, function(error)
		if #error > 0 then
			return
		end
		RetrieveItemUsesComponents()
	end)
end)

function RegisterRandomItems() end

function RunSpeed(modifier, duration, cd, ss)
	CreateThread(function()
		local c = 0
		if not ss then
			AnimpostfxPlay("DrugsTrevorClownsFight", 0, true)
		end
		while LocalPlayer.state.loggedIn and c < duration and not LocalPlayer.state.drugsRunSpeed do
			c = c + 1
			SetPedMoveRateOverride(PlayerPedId(), modifier)
			Wait(1)
		end
		SetPedMoveRateOverride(PlayerPedId(), 0.0)
		AnimpostfxStop("DrugsTrevorClownsFight")
		Wait(cd)
		_energyCd = false
	end)
end

RegisterNetEvent("Inventory:Client:SpeedyBoi", function(modifier, duration, cd, skipScreenEffects)
	if not _energyCd then
		_energyCd = true
		RunSpeed(modifier, duration, cd, skipScreenEffects)
	end
end)

RegisterNetEvent("Inventory:Client:HealthModifier", function(healthMod)
	local currentHealth = GetEntityHealth(LocalPlayer.state.ped)
	local newHealth = math.min(180, currentHealth + healthMod)

	if newHealth > currentHealth then
		SetEntityHealth(LocalPlayer.state.ped, math.floor(newHealth))
	end
end)

RegisterNetEvent("Inventory:Client:ArmourModifier", function(mod)
	if not LocalPlayer.state.armourModCooldown or LocalPlayer.state.armourModCooldown <= GetGameTimer() then
		local currentArmour = GetPedArmour(LocalPlayer.state.ped)
		local newArmour = math.min(60, currentArmour + mod)

		if newArmour > currentArmour then
			SetPedArmour(LocalPlayer.state.ped, math.floor(newArmour))
		end

		LocalPlayer.state.armourModCooldown = GetGameTimer() + ((60 * 1000) * 5)
	end
end)

RegisterNetEvent("Inventory:Client:RandomItems:BirthdayCake", function()
	Sounds.Play:Distance(20.0, "birthday.ogg", 0.2)
end)

RegisterNetEvent("Inventory:Client:Signs:UseSign", function(item)
	if item.Name then
		Animations.Emotes:Play(item.Name, false, false, false)
	end
end)