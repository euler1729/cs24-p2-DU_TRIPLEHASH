SELECT trips.*, active_trip.*
FROM trips
LEFT JOIN active_trip ON trips.trip_id = active_trip.trip_id
WHERE active_trip.trip_id IS NULL;
