class UrbanTerm {
    constructor(
        public definition: string,
        public permalink: string,
        public thumbsUp: number,
        public author: string,
        public word: string,
        public defid: string,
        public currentVote: number,
        public writtenOn: string,
        public example: string,
        public thumbsDown: number
    ) { }

    static fromData(data: any): UrbanTerm {
        return new UrbanTerm(
            data.definition,
            data.permalink,
            data.thumbs_up,
            data.author,
            data.word,
            data.defid,
            data.current_vote,
            data.written_on,
            data.example,
            data.thumbs_down
        );
    }
}

export default UrbanTerm