import { useContext, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { ExpensesOutput } from "../components/ExpensesOutput/ExpensesOutput";
import { ErrorOverlay } from "../components/UI/ErrorOverlay";
import { LoadingOverlay } from "../components/UI/LoadingOverlay";
import { ExpensesContext } from "../store/expenses-context";
import { getDateMinusDays } from "../util/date";
import { fetchExpenses } from "../util/http";

export const RecentExpenses = (params) => {
  const expensesCtx = useContext(ExpensesContext);
  const [isFetching, setIsFetching] = useState(true);
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
  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);
    return expense.date >= date7DaysAgo && expense.date <= today;
  });
  if (isFetching) {
    return <LoadingOverlay />;
  }

  if (error && !isFetching) {
    return <ErrorOverlay message={error} />;
  }
  return (
    <ExpensesOutput
      expensesPeriod="Last 7 days"
      expenses={recentExpenses}
      fallbackText="No expenses registered for the last  7 days."
    />
  );
};
