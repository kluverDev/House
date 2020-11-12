//variables? means variables feed is optional because not every request need variables
interface Body <TVariables>{
    query: string;
    variables?: TVariables;
}

export const server = {
    //TData and TVariables defaults to the any type if no type is passed
    fetch: async <TData = any, TVariables = any>(body: Body<TVariables>) => {
        console.log("IN SERVER FUNCTION")

        const res = await fetch("/api", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        });
        
        console.log("RETURNING JSON FROM SERVER FUNCTION")
        

        return res.json() as Promise<{data: TData}>;
    }
}