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

DROP TABLE IF EXISTS user_ward;
CREATE TABLE user_ward(
    user_id INTEGER,
    ward_number INTEGER
);

-- DROP TABLE IF EXISTS role;
-- CREATE TABLE roles(
--     role_id INTEGER PRIMARY KEY,
--     role_name TEXT,
--     role_desc TEXT
-- );

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


DROP TABLE if EXISTS permission;
CREATE TABLE permission(
    permission_id INTEGER PRIMARY KEY,
    permission_name TEXT,
    permission_desc TEXT
);

DROP TABLE IF EXISTS role_permission;
CREATE TABLE role_permission(
    role_id INTEGER,
    permission_id INTEGER,
    FOREIGN KEY(role_id) REFERENCES role(role_id),
    FOREIGN KEY(permission_id) REFERENCES permission(permission_id)
);
DROP TABLE IF EXISTS user_permission;
CREATE TABLE user_permission(
    user_id INTEGER,
    permission_id INTEGER,
    FOREIGN KEY(user_id) REFERENCES user(user_id),
    FOREIGN KEY(permission_id) REFERENCES permission(permission_id)
);


<<<<<<< HEAD
DROP TABLE IF EXISTS employee;
CREATE TABLE employee(
    employee_id INTEGER PRIMARY KEY,
    full_name TEXT,
    job_title TEXT,
    payment_rate_per_hour  TEXT,
    assigned_collection_route  TEXT,
    dob TEXT,
    date_of_hire TEXT,
    contact TEXT
);

DROP TABLE IF EXISTS work_log;
CREATE TABLE work_log(
    log_id INT PRIMARY KEY,
    emp_id INT,
    log_in TIMESTAMP,
    log_out TIMESTAMP,
    total_hrs HOURS,
    overtime_hrs HOURS,
    is_present int
);

DROP TABLE IF EXISTS collection;
CREATE TABLE collection(
    collection_id INTEGER PRIMARY KEY,
    start_time TEXT,
    duration HOURS,
    no_labour INT,
    no_vans INT,
    exp_wt INT,
    area TEXT

);
=======



-- __________________________________________Extension________________________________________



-- essentials for 3rd-party contractor 
DROP TABLE IF EXISTS third_party_contractor;
CREATE TABLE third_party_contractor(
    contract_id INTEGER PRIMARY KEY,
    reg_id TEXT,
    company_name TEXT,
    tin TEXT,
    contact_num TEXT,
    workforce_size INTEGER,
    payment_per_ton REAL,
    waste_amount_per_day REAL,
    contract_duration REAL,
    collection_area TEXT,
    designated_sts INTEGER, 
    FOREIGN KEY (designated_sts) REFERENCES sts(sts_id)
);

DROP TABLE IF EXISTS contractor_manager;
CREATE TABLE contractor_manager (
    user_id INTEGER PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    date_of_creation TEXT,
    contact_number TEXT,
    assigned_contractor_company INTEGER,
    access_level INTEGER,
    username TEXT,
    password TEXT,
    FOREIGN KEY (assigned_contractor_company) REFERENCES third_party_contractor(contract_id)
);
<<<<<<< HEAD



-- Community Users
DROP TABLE IF EXISTS user_posts;
CREATE TABLE user_posts (
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    title TEXT,
    post_content TEXT,
    creation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    likes_count INTEGER DEFAULT 0,
    image BLOB,
    approved BOOLEAN DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);


DROP TABLE IF EXISTS post_comments;
CREATE TABLE post_comments (
    comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    user_id INTEGER,
    comment_text TEXT,
    creation_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES user_posts(post_id),
    FOREIGN KEY (user_id) REFERENCES user(user_id)
);

DROP TABLE IF EXISTS post_likes;
CREATE TABLE post_likes (
    like_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    post_id INTEGER,
    UNIQUE(user_id, post_id),  -- Ensure each user can like a post only once
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (post_id) REFERENCES user_posts(post_id)
);


=======
>>>>>>> main
>>>>>>> 95195d72ed6511598d610a584e0cd2a5fa771925
