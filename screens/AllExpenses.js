import { useContext, useEffect, useState } from "react";
import { ExpensesOutput } from "../components/ExpensesOutput/ExpensesOutput";
import { ErrorOverlay } from "../components/UI/ErrorOverlay";
import { LoadingOverlay } from "../components/UI/LoadingOverlay";
import { ExpensesContext } from "../store/expenses-context";
import { fetchExpenses } from "../util/http";

export const AllExpenses = (params) => {
  const expensesCtx = useContext(ExpensesContext);
  const [isFetching, setIsFetching] = useState(true);
  // const [fetchedExpenses, setFetchedExpenses] = useState([]);
  const [error, setError] = useState();
  // const [fetchedExpenses, setFetchedExpenses] = useState([]);
  useEffect(() => {
    const getExpenses = async () => {
      setIsFetching(true);
      try {
        const expenses = await fetchExpenses();
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError("Could not fetch expenses!");
      }

      setIsFetching(false);
    };

    getExpenses();
  }, []);
  if (isFetching) {
    return <LoadingOverlay />;
  }
  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }
  return (
    <ExpensesOutput
      expensesPeriod="Total"
      expenses={expensesCtx.expenses}
      fallbackText="No registered expenses found."
    />
  );
};
