interface Body {
    query: string;
}

export const server = {
    fetch: async <TData = any>(body: Body) => {
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