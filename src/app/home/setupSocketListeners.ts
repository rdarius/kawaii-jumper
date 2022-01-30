import { MapTile } from "../../../../Kawaii-Jumper-server/src/mapTile";
import { Globals } from "./globals";
import { MySocket } from "./mySocket";
import { Players } from "./players";
import { PlayerDTO, PlayerDTOList, StringNumber, StringString, StringVector } from "./types.dto";

export const setupSocketListeners = () => {
    const mySocket = MySocket.getInstance();
    const players = Players.getInstance();
    const globals = Globals.getInstance();
    mySocket.onId((id: string) => (globals.socketId = id));
    mySocket.onMap((map: MapTile[]) => (globals.map = map));
    mySocket.onPlayerConnected((playersList: PlayerDTOList) =>
      players.addMultiplaPlayers(playersList),
    );
    mySocket.onNewPlayerConnected((player: PlayerDTO) =>
      players.addPlayer(player),
    );
    mySocket.onPlayerDisconnected((id: string) =>
      players.removePlayer(id),
    );
    mySocket.onUpdatedPlayerColor((playersColor: StringNumber) =>
      players.updatePlayerColor(playersColor),
    );
    mySocket.onUpdatedPlayerPosition((playersPosition: StringVector) =>
      players.updatePlayerPosition(playersPosition),
    );
    mySocket.onUpdatedPlayerDirection((playersDirection: StringNumber) =>
      players.updatePlayerDirection(playersDirection),
    );
    mySocket.onNameChanged((playersName: StringString) =>
      players.updatePlayerNames(playersName),
    );
  }