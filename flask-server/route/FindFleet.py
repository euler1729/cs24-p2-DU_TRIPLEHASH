
import numpy as np

# Define the Vehicle class


class Vehicle():
    def __init__(self, id, capacity, loaded_cost, unloaded_cost):
        self.id = id
        self.capacity = capacity
        self.loaded_cost = loaded_cost
        self.unloaded_cost = unloaded_cost
        self.number_of_trips = 0


class optimal_cost():

    def __init__(self, vehicles, total_waste, dist):

        self.memo = np.full(
            (len(vehicles) + 1, total_waste + 1), -1, dtype=float)
        self.weight = np.zeros(
            (len(vehicles) + 1, total_waste + 1), dtype=float)
        self.vehicles = vehicles
        self.total_waste = total_waste
        self.n = len(vehicles)
        self.trips = []
        self.distance = dist
        self.no_v = 0

    def findOptimal(self):
        cost = self.dp(0, self.total_waste)
        self.trips = []
        self.print_path(0, self.total_waste)
        
        if cost == np.inf:
            cost = 0
            for v in self.vehicles:
                for i in range(3):
                    v.number_of_trips += 1
                    self.trips.append(({
                        "vehicle_id": v.id,
                        "load": v.capacity,
                        "cost":  round((v.unloaded_cost*2 + (v.loaded_cost - v.unloaded_cost)/v.capacity), 2),
                        "trip_number": v.number_of_trips
                    }))
                cost += round((v.unloaded_cost*2 +
                              (v.loaded_cost - v.unloaded_cost)/v.capacity)*3, 2)
            self.no_v = len(self.vehicles)
        sum_of_trip_cost = 0
        for trip in self.trips:
            sum_of_trip_cost += trip['cost']
        print(sum_of_trip_cost, cost)
        return sum_of_trip_cost, self.trips

    def dp(self, idx, tot):

        if tot <= 0:
            return 0
        if idx == self.n:
            return np.inf

        if self.memo[idx][tot] != -1:
            return self.memo[idx][tot]
        ans = np.inf
        w = 0
        for i in range(0, min(3 * self.vehicles[idx].capacity + 1, tot + 1)):
            c = self.cal_cost(idx, i) + self.dp(idx + 1, tot - i)
            if c < ans:
                ans = c
                w = i
        self.memo[idx][tot] = ans
        self.weight[idx][tot] = w
        return ans

    def cal_cost(self, idx, waste):
        cnt = 0
        cost = 0
        capacity = self.vehicles[idx].capacity
        while waste > 0:
            cost = cost + self.vehicleCost(self.vehicles[idx], waste)
            cnt = cnt + 1
            waste -= min(waste, capacity)
        return cost

    def print_path(self, idx, total_waste):
        if idx == self.n:
            return
        load = self.weight[idx][total_waste]
        while load > 0:
            cap = self.vehicles[idx].capacity
            if self.vehicles[idx].number_of_trips == 0:
                self.no_v += 1
            self.vehicles[idx].number_of_trips += 1
            self.trips.append(({
                "vehicle_id": self.vehicles[idx].id,
                "load": min(cap, load),
                "cost": round(self.vehicleCost(self.vehicles[idx], min(self.vehicles[idx].capacity, load)), 2),
                "trip_number": self.vehicles[idx].number_of_trips
            }))
            load -= min(self.vehicles[idx].capacity, load)
        self.print_path(idx + 1, int(total_waste) -
                        int(self.weight[idx][total_waste]))

    def vehicleCost(self, vehicle, load):
        return vehicle.unloaded_cost*2 + load*(vehicle.loaded_cost - vehicle.unloaded_cost)/vehicle.capacity
