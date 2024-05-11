"""Simple Vehicles Routing Problem (VRP).

   This is a sample using the routing library python wrapper to solve a VRP
   problem.
   A description of the problem can be found here:
   http://en.wikipedia.org/wiki/Vehicle_routing_problem.

   Distances are in meters.
"""

from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

map_data = [
    {
        "source": "dhaka",
        "dest": "khulna",
        "cost": 45
    },
    {
        "source": "dhaka",
        "dest": "sylhet",
        "cost": 25
    },
    {
        "source": "dhaka",
        "dest": "bogura",
        "cost": 35 
    },
    {
        "source": "khulna",
        "dest": "sylhet",
        "cost": 23
    },
    {
        "source": "khulna",
        "dest": "bogura",
        "cost": 1
    },
    {
        "source": "sylhet",
        "dest": "bogura",
        "cost": 50
    },
]

# Create a set to collect unique sources and destinations
unique_places = set()

# Collect unique sources and destinations
for entry in map_data:
    unique_places.add(entry["source"])
    unique_places.add(entry["dest"])

# Create a mapping dictionary from unique places to integers
place_to_int = {place: i for i, place in enumerate(unique_places)}

# Reverse the mapping to get back the strings from integers
int_to_place = {i: place for place, i in place_to_int.items()}

n = 4

graph = [[0] * (n) for _ in range(n)]

for entry in map_data:
    u = place_to_int[entry['source']]
    v = place_to_int[entry['dest']]
    w = int(entry['cost'])
    # print(w)
    graph[u][v] = w
    graph[v][u] = w



def create_data_model():
    """Stores the data for the problem."""
    data = {}

    # Convert the JSON data into a 2D list format suitable for the tsp function
    data['distance_matrix'] = graph

    # data["distance_matrix"] = [
    #     # fmt: off
    #   [0, 548, 776, 696, 582, 274, 502, 194, 308, 194, 536, 502, 388, 354, 468, 776, 662],
    #   ...
    # ]

    data["num_vehicles"] = 4
    data["depot"] = 0
    return data



def print_solution(data, manager, routing, solution):
    """Prints solution on console."""
    print(f"Objective: {solution.ObjectiveValue()}")
    max_route_distance = 0
    for vehicle_id in range(data["num_vehicles"]):
        index = routing.Start(vehicle_id)
        plan_output = f"Route for vehicle {vehicle_id}:\n"
        route_distance = 0
        while not routing.IsEnd(index):
            plan_output += f" {int_to_place[manager.IndexToNode(index)]} -> "
            previous_index = index
            index = solution.Value(routing.NextVar(index))
            route_distance += routing.GetArcCostForVehicle(
                previous_index, index, vehicle_id
            )
        plan_output += f"{int_to_place[manager.IndexToNode(index)]}\n"
        plan_output += f"Distance of the route: {route_distance}m\n"
        print(plan_output)
        max_route_distance = max(route_distance, max_route_distance)
    print(f"Maximum of the route distances: {max_route_distance}m")





def main():
    """Entry point of the program."""
    # Instantiate the data problem.
    data = create_data_model()

    # Create the routing index manager.
    manager = pywrapcp.RoutingIndexManager(
        len(data["distance_matrix"]), data["num_vehicles"], data["depot"]
    )

    # Create Routing Model.
    routing = pywrapcp.RoutingModel(manager)

    # Create and register a transit callback.
    def distance_callback(from_index, to_index):
        """Returns the distance between the two nodes."""
        # Convert from routing variable Index to distance matrix NodeIndex.
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return data["distance_matrix"][from_node][to_node]

    transit_callback_index = routing.RegisterTransitCallback(distance_callback)

    # Define cost of each arc.
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    # Add Distance constraint.
    dimension_name = "Distance"
    routing.AddDimension(
        transit_callback_index,
        0,  # no slack
        3000,  # vehicle maximum travel distance
        True,  # start cumul to zero
        dimension_name,
    )
    distance_dimension = routing.GetDimensionOrDie(dimension_name)
    distance_dimension.SetGlobalSpanCostCoefficient(100)

    # Setting first solution heuristic.
    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )

    # Solve the problem.
    solution = routing.SolveWithParameters(search_parameters)

    # Print solution on console.
    if solution:
        print_solution(data, manager, routing, solution)
    else:
        print("No solution found !")


if __name__ == "__main__":
    main()