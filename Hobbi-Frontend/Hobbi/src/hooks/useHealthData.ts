import { useEffect, useState } from "react";
import AppleHealthKit, {
  HealthInputOptions,
  HealthKitPermissions,
  HealthUnit,
  HealthValue,
  AnchoredQueryResults,
} from "react-native-health";
import { Platform } from "react-native";
import { calculateDuration } from "../utils/dateUtils";

// Starter code for getting permissions and data for AppleHealthKit referenced from https://www.notjust.dev/projects/step-counter/apple-healthkit

const { Permissions } = AppleHealthKit.Constants;

const permissions: HealthKitPermissions = {
  permissions: {
    read: [Permissions.Steps, Permissions.SleepAnalysis, Permissions.Workout],
    write: [],
  },
};

const useHealthData = () => {
  const date = new Date();
  const defaultSleep = {
    id: "defaultId",
    startDate: date,
    endDate: date,
    hours: 0,
    minutes: 0,
  };
  const yesterday = new Date(date);
  yesterday.setDate(date.getDate() - 1);
  // Adjust date to get sleep values from last 24 hours

  const [hasPermissions, setHasPermission] = useState(false);
  const [steps, setSteps] = useState(0);
  const [sleep, setSleep] = useState<SleepLog>({ ...defaultSleep });
  const [workouts, setWorkouts] = useState<AnchoredQueryResults>();

  useEffect(() => {
    if (Platform.OS !== "ios") {
      return;
    }

    AppleHealthKit.isAvailable((err, isAvailable) => {
      if (err) {
        console.log("Error checking availability");
        return;
      }
      if (!isAvailable) {
        console.log("Apple Health not available");
        return;
      }
      AppleHealthKit.initHealthKit(permissions, (err) => {
        if (err) {
          console.log("Error getting permissions");
          return;
        }
        setHasPermission(true);
      });
    });
  }, []);

  useEffect(() => {
    if (!hasPermissions) {
      return;
    }

    const options: HealthInputOptions = {
      date: date.toISOString(),
    };

    const yesterdayOptions: HealthInputOptions = {
      startDate: yesterday.toISOString(),
    };

    AppleHealthKit.getStepCount(options, (err, results) => {
      if (err) {
        console.log("Error getting steps data");
        return;
      }
      setSteps(results.value);
    });

    AppleHealthKit.getSleepSamples(yesterdayOptions, (err, results) => {
      if (err) {
        console.log("Error getting sleep data");
        return;
      }
      // Results are of type HealthValue[]
      // Must convert to singular HealthValue that represents sleep (gets longest sleep log)

      // console.log(results);

      const filteredResults = results.filter((log) => {
        return typeof log.value === "string" && log.value === "ASLEEP";
      });

      let longestSleepLog;
      if (filteredResults.length > 0) {
        longestSleepLog = filteredResults.reduce((prev, current) => {
          const prevDuration =
            new Date(prev.endDate).getTime() -
            new Date(prev.startDate).getTime();
          const currentDuration =
            new Date(current.endDate).getTime() -
            new Date(current.startDate).getTime();

          return prevDuration > currentDuration ? prev : current;
        });
      } else {
        longestSleepLog = null;
      }

      if (longestSleepLog) {
        const mappedSleepLog: SleepLog = {
          id: longestSleepLog.id || "defaultId",
          startDate: new Date(longestSleepLog.startDate),
          endDate: new Date(longestSleepLog.endDate),
          ...calculateDuration(
            longestSleepLog.startDate,
            longestSleepLog.endDate
          ),
        };
        setSleep(mappedSleepLog);
      }
    });

    AppleHealthKit.getAnchoredWorkouts(yesterdayOptions, (err, results) => {
      if (err) {
        console.log("Error getting workout data");
        return;
      }
      // const allWorkouts
      console.log(results.data);

      setWorkouts(results);
    });
  }, [hasPermissions]);

  return { steps, sleep, workouts };
};

export default useHealthData;