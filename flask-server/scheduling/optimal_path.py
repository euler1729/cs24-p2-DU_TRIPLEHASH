
data = {
    {
        "u": "place1",
        "v": "place2",
        "w": 45.5
    },
    {
        "u": "place1",
        "v": "place3",
        "w": 25
    },
    {
        "u": "place1",
        "v": "place4",
        "w": 35 
    },
    {
        "u": "place2",
        "v": "place3",
        "w": 23
    },
    {
        "u": "place2",
        "v": "place4",
        "w": 1
    },
    {
        "u": "place3",
        "v": "place4",
        "w": 50
    },
}

# Convert the JSON data into a 2D list format suitable for the tsp function
def convert_to_graph(data):
    graph = [[INF] * (n + 1) for _ in range(n + 1)]  # Initialize the graph with INF values
    
    # Populate the graph with edge weights from the JSON data
    for edge in data:
        u = int(edge["u"][-1])  # Extract the node number from the place name
        v = int(edge["v"][-1])
        w = edge["w"]
        graph[u][v] = w
        graph[v][u] = w  # Assuming the graph is undirected
    
    return graph

# Convert the JSON data to a 2D graph
graph = convert_to_graph(data)


n = 4  # Number of nodes(1-based)

# infinity as a large value
INF = 10**9

# dist[][] will contain the distances between every pair of vertices 
def floydWarshall(graph):
    V = n + 1
    # Initialize dist 
    dist = list(map(lambda i: list(map(lambda j: j, i)), graph))

    # Pick every vertex as intermediary and check if there's a better path using that vertex
    for k in range(1, V):

        # pick all vertices as source one by one
        for i in range(1, V):
        
            # Pick all vertices as destination for the above picked source
            for j in range(1, V):
        
                # Update dist if the path through k is the best one
                dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
    
    return dist



# # dist[i][j]  = shortest distance to go from node i to node j

# graph = [       [0, 0, 0, 0, 0],
#                 [0, 0, 1, 1, 1000],
#                 [0, 1, 0, 1000, 1],
#                 [0, 1, 1000, 0, 1],
#                 [0, 1000, 1, 1, 0]
#         ]

dist = floydWarshall(graph)

print(dist)


# Memoization 
memo = [[-1] * (1 << (n + 1)) for _ in range(n + 1)]



# This function takes a node and the mask of visited nodes
# Returns the cost and path from 1 to i 
def tsp(i, mask):
    # if only i-th and 1st bit set -> all other nodes are visited
    if mask == ((1 << i) | 1):
        return dist[1][i], [1, i] 

    # Memoization
    if memo[i][mask] != -1:
        return memo[i][mask]

    res = 10**9 
    best_path = []

    """ For every node j in the mask, except i and 1, calculate the cost of traveling all nodes in the mask and then travel back from node j to node i taking the shortest path 
    Take the minimum of all possible j nodes """
    for j in range(1, n + 1):
        if (mask & (1 << j)) != 0 and j != i and j != 1:
            cost, path = tsp(j, mask & (~(1 << i)))
            cost += dist[j][i]
            if cost < res:
                res = cost
                best_path = path + [i]

    memo[i][mask] = res, best_path  # Storing the min value and the path
    return res, best_path


ans = 10**9  # For storing the final cost
optimal_path = []

for i in range(1, n + 1):
    # Try to go from node 1 visiting all nodes in between to i
    # then return from i taking the shortest route to 1
    cost, path = tsp(i, (1 << (n + 1)) - 1)
    cost += dist[i][1]  # Add the cost to return from i to 1
    if cost < ans:
        ans = cost
        optimal_path = path

# Convert node numbers to names
optimal_path_names = ["place" + str(node) for node in optimal_path]

print("The cost of the most efficient tour =", ans)
print("The optimal path is:", optimal_path_names)
