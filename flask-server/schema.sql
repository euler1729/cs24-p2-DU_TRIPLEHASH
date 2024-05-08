DROP TABLE IF EXISTS user;
CREATE TABLE user(
    user_id INTEGER PRIMARY KEY,
    user_name TEXT,
    email TEXT,
    password TEXT,
    role_id INTEGER,
    name TEXT,
    age INTEGER,
    phone_number TEXT
);


DROP TABLE IF EXISTS role;
CREATE TABLE role(
    role_id INTEGER PRIMARY KEY,
    role_name TEXT
);


DROP TABLE IF EXISTS otp;
CREATE TABLE otp(
    user_id INTEGER,
    otp TEXT,
    exp INTEGER
);



DROP TABLE IF EXISTS vehicle;
CREATE TABLE vehicle (
    vehicle_id INTEGER PRIMARY KEY,
    vehicle_reg_number TEXT,
    vehicle_type TEXT,
    vehicle_capacity_in_ton INTEGER,
    fuel_cost_per_km_loaded INTEGER,
    fuel_cost_per_km_unloaded INTEGER,
    sts_id INTEGER,  
    FOREIGN KEY (sts_id) REFERENCES STS(STS_ID) -- id of the Station of the Vehicle
);



DROP TABLE IF EXISTS sts;
CREATE TABLE sts (
    sts_id INTEGER PRIMARY KEY,
    ward_number INTEGER,
    capacity_tonnes INTEGER,
    gps_longitude REAL,
    gps_latitude REAL,
    waste REAL
);



DROP TABLE IF EXISTS sts_managers;
CREATE TABLE sts_managers (
    manager_id INTEGER PRIMARY KEY,
    user_id INTEGER UNIQUE,  -- Link STS manager to user
    sts_id INTEGER,  -- Link manager to sts

    FOREIGN KEY (user_id) REFERENCES user(user_id),  
    FOREIGN KEY (sts_id) REFERENCES sts(sts_id)  -- id for station of the manager
);



DROP TABLE IF EXISTS vehicle_entries;
CREATE TABLE vehicle_entries (
    entry_id INTEGER PRIMARY KEY,
    sts_id INTEGER,
    vehicle_number TEXT,
    weight_of_waste INTEGER,
    time_of_arrival TEXT,
    time_of_departure TEXT,
    FOREIGN KEY (sts_id) REFERENCES sts(sts_id)
);



DROP TABLE IF EXISTS landfill_sites;
CREATE TABLE landfill_sites (
    landfill_id INTEGER PRIMARY KEY,
    site_name TEXT,
    capacity INTEGER,
    operational_timespan TEXT,
    gps_longitude REAL,
    gps_latitude REAL
);



DROP TABLE IF EXISTS landfill_managers;
CREATE TABLE landfill_managers (
    manager_id INTEGER PRIMARY KEY,
    user_id INTEGER UNIQUE,  -- Link Landfill manager to user
    landfill_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (landfill_id) REFERENCES landfill_sites(landfill_id)
);



DROP TABLE IF EXISTS dump_entries;
CREATE TABLE dump_entries (
    entry_id INTEGER PRIMARY KEY,
    landfill_id INTEGER,
    manager_id INTEGER,  -- Id of landfill manager
    vehicle_id INTEGER,
    weight_of_waste INTEGER,
    time_of_arrival TEXT,
    time_of_departure TEXT,
    
    FOREIGN KEY (landfill_id) REFERENCES landfill_sites(landfill_id),
    FOREIGN KEY (manager_id) REFERENCES sts_managers(manager_id)
);

DROP TABLE IF EXISTS trips;
CREATE TABLE trips(
    trip_id INTEGER PRIMARY KEY,
    vehicle_id INTEGER,
    sts_id INTEGER,
    landfill_id INTEGER,
    start_time DATETIME,
    dump_time DATETIME,
    end_time DATETIME,
    cost REAL,
    fuel REAL,
    load REAL,
    FOREIGN KEY(vehicle_id) REFERENCES vehicle(vehicle_id),
    FOREIGN KEY(sts_id) REFERENCES sts(sts_id),
    FOREIGN KEY(landfill_id) REFERENCES landfill_sites(landfill_id)
);


DROP TABLE IF EXISTS active_trip;
CREATE TABLE active_trip(
    trip_id INTEGER PRIMARY KEY,
    vehicle_id INTEGER,
    to_landfill INTEGER,
    FOREIGN KEY(trip_id) REFERENCES trips(trip_id),
    FOREIGN KEY(vehicle_id) REFERENCES vehicle(vehicle_id)
);

DROP TABLE IF EXISTS roles;
CREATE TABLE roles(
    role_id INTEGER PRIMARY KEY,
    role_name TEXT,
    role_desc TEXT
);
DROP TABLE if EXISTS permission;
CREATE TABLE permission(
    permission_id INTEGER PRIMARY KEY,
    permission_name TEXT,
    permission_desc TEXT
);

DROP TABLE if EXISTS roles_permission;
CREATE TABLE role_permission(
    role_id INTEGER,
    permission_id INTEGER,
    FOREIGN KEY(role_id) REFERENCES roles(role_id),
    FOREIGN KEY(permission_id) REFERENCES permission(permission_id)
);
DROP TABLE IF EXISTS user_permission;
CREATE TABLE user_permission(
    user_id INTEGER,
    permission_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES user(user_id),
    FOREIGN KEY(permission_id) REFERENCES permission(permission_id)
);


