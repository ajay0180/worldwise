import { createContext, useEffect, useContext, useReducer, act } from "react";

const CitiesContext = createContext();

const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };
    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type.");
  }
}

function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );

  useEffect(function () {
    async function fetchCities() {
      try {
        dispatch({ type: "loading" });
        const res = await fetch("http://localhost:9000/cities");
        const data = await res.json();

        dispatch({ type: "city/loaded", payload: data });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading data...",
        });
      }
    }

    fetchCities();
  }, []);

  async function getCity(id) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:9000/cities/${id}`);
      const data = await res.json();

      dispatch({ type: "city/loaded", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading data.",
      });
    }
  }

  async function createCity(newCity) {
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:9000/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        header: {
          "Content-type": "application/json",
        },
      });
      const data = await res.json();
      // console.log(data);

      dispatch({ type: "city/created", payload: data });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error creating the city.",
      });
    }
  }

  async function deleteCity(id) {
    if (currentCity?.id === Number(id)) return;
    try {
      dispatch({ type: "loading" });
      const res = await fetch(`http://localhost:9000/cities/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      // console.log(data);

      dispatch({ type: "city/deleted", payload: data.id });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting the city.",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

function useCities() {
  const context = useContext(CitiesContext);

  if (context === undefined)
    throw new Error("Cititescontext is used outside the scope.");

  return context;
}

export { CitiesProvider, CitiesContext, useCities };
