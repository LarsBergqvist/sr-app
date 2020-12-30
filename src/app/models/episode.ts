export interface Episode {
    title: string;
    id: number;
    description: string;
    starttimeutc: Date;
    broadcasttime: {
        starttimeutc: string;
        endtimeutc: string;
    },
    program: {
        id: number,
        name: string
    },
    listenpodfile: {
        url: string
    }
}
