import { useState, useEffect, useCallback } from "react";
import { server } from "./server";

interface State<TData> {
  data: TData | null;
}

export const useQuery = <TData = any>(query: string) => {
  const [state, setState] = useState<State<TData>>({ data: null });
  console.log("in usequery");

  const fetch = useCallback(() => {
    const fetchApi = async () => {
      const { data } = await server.fetch<TData>({
        query,
      });
      console.log("before setstate fetchApi usecallback");

      setState({ data });
      console.log("After setstate fetchApi usecallback");
    };
    console.log("in use callbackk");

    fetchApi();
  }, [query]);

  useEffect(() => {
    console.log("usequerry useeffect");

    fetch();
  }, [fetch]);
  console.log("before eturn state");
  return { ...state, refetch: fetch };
};
