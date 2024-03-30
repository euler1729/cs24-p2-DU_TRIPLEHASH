
import numpy as np

# Define the Vehicle class


class Vehicle():
    def __init__(self, id, capacity, loaded_cost, unloaded_cost):
        self.id = id
        self.capacity = capacity
        self.loaded_cost = loaded_cost
        self.unloaded_cost = unloaded_cost


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

    def findOptimal(self):
        cost = self.dp(0, self.total_waste)
        self.trips = []
        self.print_path(0, self.total_waste)
        return cost*self.distance, self.trips

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
            self.trips.append(({
                "vehicle_id": self.vehicles[idx].id,
                "load": min(cap, load),
                "cost": self.vehicleCost(self.vehicles[idx], min(self.vehicles[idx].capacity, load))*self.distance
            }))
            load -= min(self.vehicles[idx].capacity, load)
        self.print_path(idx + 1, int(total_waste) -
                        int(self.weight[idx][total_waste]))

    def vehicleCost(self, vehicle, load):
        return vehicle.unloaded_cost*2 + load*(vehicle.loaded_cost - vehicle.unloaded_cost)/vehicle.capacity
