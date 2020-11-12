//variables? means variables feed is optional because not every request need variables
interface Body <TVariables>{
    query: string;
    variables?: TVariables;
}

export const server = {
    //TData and TVariables defaults to the any type if no type is passed
    fetch: async <TData = any, TVariables = any>(body: Body<TVariables>) => {
        console.log("eight")

        const res = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        console.log(res, "res")
        console.log(res.json, "res.json")

        return res.json() as Promise<{data: TData}>;
    }
}