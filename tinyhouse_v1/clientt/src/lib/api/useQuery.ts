import { useState, useEffect, useCallback } from "react";
import { server } from "./server";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: boolean;
}

interface QueryResult<TData> extends State<TData> {
  refetch: () => void;
}

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
  const [state, setState] = useState<State<TData>>({
    data: null,
    loading: false,
    error: false,
  });
  console.log("in usequery");

  const fetch = useCallback(() => {
    const fetchApi = async () => {
      try {
        setState({ data: null, loading: true, error: false });
        const { data, errors } = await server.fetch<TData>({
          query,
        });
        console.log("before setstate fetchApi usecallback");
        if (errors && errors.length) {
            throw new Error(errors[0].message);

          }
  
        setState({ data, loading: false, error: false });
        console.log("After setstate fetchApi usecallback");

        console.log("in use callbackk");
      } catch (err){
        setState({
          data: null,
          loading: false,
          error: true,
        });
        throw console.error(err,"hi");

      }
    };
    fetchApi();
  }, [query]);

  useEffect(() => {
    console.log("usequerry useeffect");

    fetch();
  }, [fetch]);
  console.log("before eturn state");
  return { ...state, refetch: fetch };
};
