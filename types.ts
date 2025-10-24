
export enum Division {
    D1 = 'Division 1',
    D2 = 'Division 2',
}

export enum Position {
    MAIN_NETTY = 'Main Netty',
    LEFT_NETTY = 'Left Netty',
    RIGHT_NETTY = 'Right Netty',
    LEFT_FRONT = 'Left front',
    RIGHT_FRONT = 'Right front',
    NET_CENTER = 'Net center',
    LEFT_BACK = 'Left Back',
    RIGHT_BACK = 'Right Back',
    BACK_CENTER = 'Back Center',
    SERVICE_MAN = 'Service man',
}

export interface Player {
    id: string;
    playerName: string;
    division: Division;
    position: Position;
}

export type PlayerData = Omit<Player, 'id'>;

export interface Submission {
    id: string;
    teamName: string;
    submittedAt: string; // ISO string
    players: PlayerData[];
}
