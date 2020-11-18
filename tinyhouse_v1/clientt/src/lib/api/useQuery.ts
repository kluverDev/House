import { useEffect, useCallback, useReducer } from "react";
import { server } from "./server";

interface State<TData> {
  data: TData | null;
  loading: boolean;
  error: boolean;
}

interface QueryResult<TData> extends State<TData> {
  refetch: () => void;
}

type Action<TData> =
  | { type: "FETCH" }
  | { type: "FETCH_SUCCESS"; payload: TData }
  | { type: "FETCH_ERROR" };

//A `reducer()` function is a function that receives the current state
//and an action that would return the new state.
const reducer = <TData>() => (state: State<TData>, action: Action<TData>) => {
  switch (action.type) {
    case "FETCH":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: false,
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: true };
    default:
      throw new Error();
  }
};

export const useQuery = <TData = any>(query: string): QueryResult<TData> => {
  //The `useReducer` Hook takes a minimum of two arguments - the first being
  //the `reducer()` function itself and the second being the initial state.
  const fetchReducer = reducer<TData>();

  const [state, dispatch] = useReducer(fetchReducer, {
    data: null,
    loading: false,
    error: false,
  });

  console.log("in usequery");

  const fetch = useCallback(() => {
    const fetchApi = async () => {
      try {
        dispatch({ type: "FETCH" });
        const { data, errors } = await server.fetch<TData>({
          query,
        });
        console.log("before setstate fetchApi usecallback");
        if (errors && errors.length) {
          throw new Error(errors[0].message);
        }

        console.log("After setstate fetchApi usecallback");
        dispatch({ type: "FETCH_SUCCESS", payload: data });

        console.log("in use callbackk");
      } catch {
        dispatch({ type: "FETCH_ERROR" });
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
