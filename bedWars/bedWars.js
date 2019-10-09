exports.locations={  "LOBBY":{  x:-5,y:119,z:11},"BLUE":{  x:38,y:62,z:80},"RED":{  x:-38,y:62,z:-80},"ORANGE":{  x:80,y:62,z:38},"WHITE":{  x:-38,y:62,z:80}};
exports.bedWarRules = function () {
  //Instantiations;
  var block;
  var teamColor;
  self.removeMetadata ("teamcolor", __plugin );
  events.blockBreak( function (event) {
    block=event.block;
    if ((block.getType().toString().indexOf ( 'BED') > -1)){
      org.bukkit.Bukkit.dispatchCommand(org.bukkit.Bukkit.getConsoleSender(), "tellraw @a [\"" + block.getType().toString() + " Destroyed\"]");
    }
    else {
      event.cancelled = true;
    }
  });
  events.playerInteract( function (event) {
    block=event.getClickedBlock();
    if ((block) != (null)){
      if ((block.getType()) == "OAK_SIGN"){
        teamColor=((block.state.getLine(1)).toUpperCase());
        fd = new org.bukkit.metadata.FixedMetadataValue (__plugin,teamColor);
        event.player.setMetadata ("teamcolor", fd );
        console.log ("Players teamColor set to: " + teamColor);
        event.player.setHealth (0.0);
      }
    }
  });
  events.playerRespawn( function (event) {
    bedWarRespawn (event.player);
  });
  var test= setInterval (function () {
    if ((server.worlds[0].getTime()) > 5000){
      server.worlds[0].setTime(0);
      server.worlds[0].setStorm(false);
    }
    if (!(true)) {
      clearInterval (test);
    }
  }, 500);
};

exports.bedWarRespawn  = function (player) {
  //Instantiations;
  var teamColor;
  var location;
  var block;
  var color;
  var entity;
  var TeleportCause;
  if (player.getMetadata("teamcolor").length > 0){
    teamColor=(player.getMetadata("teamcolor")[0].value());
    location=(new org.bukkit.Location(server.worlds[0], locations[teamColor].x, locations[teamColor].y, locations[teamColor].z));
    block=(server.worlds[0].getBlockAt (location));
    if ((block.getType().toString().indexOf ( 'BED') > -1)){
      player.setGameMode(org.bukkit.GameMode.SURVIVAL);
      player.inventory.addItem (new org.bukkit.inventory.ItemStack (org.bukkit.Material.WHITE_WOOL,32));
      eval ("color = org.bukkit.Color." + teamColor.toUpperCase());
      var player = player;
      var items = require ('items');
      var helmet = items.leatherHelmet(1);
      var helmetMeta = helmet.itemMeta;
      helmetMeta.color = color;
      helmet.itemMeta = helmetMeta;
      player.equipment.helmet = helmet;
      var boots = items.leatherBoots(1);
      var bootsMeta = boots.itemMeta;
      bootsMeta.color = color;
      boots.itemMeta = bootsMeta;
      player.equipment.boots = boots;
      var chest = items.leatherChestplate(1);
      var chestMeta = chest.itemMeta;
      chestMeta.color = color;
      chest.itemMeta = chestMeta;
      player.equipment.chestplate = chest;
      var legs = items.leatherLeggings(1);
      var legsMeta = legs.itemMeta;
      legsMeta.color = color;
      legs.itemMeta = legsMeta;
      player.equipment.leggings = legs;
      setTimeout (function () {
        entity = player;
        entity.teleport(location, org.bukkit.event.player.PlayerTeleportEvent.TeleportCause.PLUGIN);
      },500);
    }
    else {
      player.sendMessage ("Sorry " + teamColor + " bed is destroyed");
      setTimeout (function () {
        player.setHealth (0.0);
      },500);
    }
  }
  else {
    setTimeout (function () {
      location=(new org.bukkit.Location(server.worlds[0], locations["LOBBY"].x, locations["LOBBY"].y, locations["LOBBY"].z));
      entity = player;
      entity.teleport(location, org.bukkit.event.player.PlayerTeleportEvent.TeleportCause.PLUGIN);
      player.sendMessage ("Teleport to lobby");
    },500);
  }
};
