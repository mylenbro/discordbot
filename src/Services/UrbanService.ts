import UrbanTerm from "../Classes/UrbanTerm";

class UrbanService {
    public static async get(term: string): Promise<UrbanTerm[]> {
        const json = await this.fetch(term)
        const list = json['list']
        const terms = list?.map((value: any) => { return UrbanTerm.fromData(value) })
        return terms === undefined ? [] : terms
    }

    private static async fetch(term: string): Promise<Record<string, any>> {
        const url = 'https://api.urbandictionary.com/v0/define?term='
        const response = await fetch(`${url}${term}`);
        return await response.json();
    }
}

export default UrbanService