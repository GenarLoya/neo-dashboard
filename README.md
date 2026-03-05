# NEO Dashboard

## Understanding how this API works

**API URL**: [https://api.nasa.gov/neo/rest/v1/feed](https://api.nasa.gov/neo/rest/v1/)

This API returns data about Near-Earth Objects (NEOs) - asteroids and comets that pass close to Earth. The NEO Feed API provides a list of asteroids based on their closest approach date to Earth.

## API Endpoint

```
https://api.nasa.gov/neo/rest/v1/feed?start_date=YYYY-MM-DD&end_date=YYYY-MM-DD&api_key=YOUR_API_KEY
```

### Parameters

- **start_date**: Starting date for asteroid search (format: YYYY-MM-DD)
- **end_date**: Ending date for asteroid search (format: YYYY-MM-DD, max 7 days from start_date)
- **api_key**: Your NASA API key (use `DEMO_KEY` for testing)

## TypeScript Interfaces

We can abstract the data returned by the NEO Feed API with the following TypeScript interfaces:

```ts
export type NeoFeedResponse = {
  links: {
    next: string
    prev: string
    self: string
  }
  element_count: number
  near_earth_objects: Record<string, NearEarthObject[]>
}

export type NearEarthObject = {
  links: {
    self: string
  }
  id: string
  neo_reference_id: string
  name: string
  nasa_jpl_url: string
  absolute_magnitude_h: number
  estimated_diameter: EstimatedDiameter
  is_potentially_hazardous_asteroid: boolean
  close_approach_data: CloseApproachData[]
  is_sentry_object: boolean
}

export type EstimatedDiameter = {
  kilometers: DiameterRange
  meters: DiameterRange
  miles: DiameterRange
  feet: DiameterRange
}

export type DiameterRange = {
  estimated_diameter_min: number
  estimated_diameter_max: number
}

export type CloseApproachData = {
  close_approach_date: string
  close_approach_date_full: string
  epoch_date_close_approach: number
  relative_velocity: {
    kilometers_per_second: string
    kilometers_per_hour: string
    miles_per_hour: string
  }
  miss_distance: {
    astronomical: string
    lunar: string
    kilometers: string
    miles: string
  }
  orbiting_body: string
}
```

## Response Structure

The response is organized by date, where each date key contains an array of Near-Earth Objects that have their closest approach on that date.

### Example Response

```json
{
  "links": {
    "next": "http://api.nasa.gov/neo/rest/v1/feed?start_date=2024-01-08&end_date=2024-01-15&api_key=DEMO_KEY",
    "prev": "http://api.nasa.gov/neo/rest/v1/feed?start_date=2023-12-25&end_date=2024-01-01&api_key=DEMO_KEY",
    "self": "http://api.nasa.gov/neo/rest/v1/feed?start_date=2024-01-01&end_date=2024-01-08&api_key=DEMO_KEY"
  },
  "element_count": 25,
  "near_earth_objects": {
    "2024-01-01": [
      {
        "links": {
          "self": "http://api.nasa.gov/neo/rest/v1/neo/2000433"
        },
        "id": "2000433",
        "neo_reference_id": "2000433",
        "name": "433 Eros (A898 PA)",
        "nasa_jpl_url": "http://ssd.jpl.nasa.gov/sbdb.cgi?sstr=2000433",
        "absolute_magnitude_h": 10.4,
        "estimated_diameter": {
          "kilometers": {
            "estimated_diameter_min": 22.1482454008,
            "estimated_diameter_max": 49.435619239
          },
          "meters": {
            "estimated_diameter_min": 22148.2454008106,
            "estimated_diameter_max": 49435.6192389967
          },
          "miles": {
            "estimated_diameter_min": 13.7619082867,
            "estimated_diameter_max": 30.7138821839
          },
          "feet": {
            "estimated_diameter_min": 72664.8470472768,
            "estimated_diameter_max": 162190.35540671
          }
        },
        "is_potentially_hazardous_asteroid": false,
        "close_approach_data": [
          {
            "close_approach_date": "2024-01-01",
            "close_approach_date_full": "2024-Jan-01 12:34",
            "epoch_date_close_approach": 1704114840000,
            "relative_velocity": {
              "kilometers_per_second": "5.5328278731",
              "kilometers_per_hour": "19918.1803431704",
              "miles_per_hour": "12376.1302845219"
            },
            "miss_distance": {
              "astronomical": "0.3149291829",
              "lunar": "122.5074521481",
              "kilometers": "47113176.578422823",
              "miles": "29275494.1607076424"
            },
            "orbiting_body": "Earth"
          }
        ],
        "is_sentry_object": false
      }
    ],
    "2024-01-02": [
      // More NEOs...
    ]
  }
}
```

## Understanding the Data

### Top-Level Fields

- **links**: Navigation links for paginated results
  - `next`: URL for the next 7-day period
  - `prev`: URL for the previous 7-day period
  - `self`: URL for the current query
  
- **element_count**: Total number of NEOs in the response across all dates

- **near_earth_objects**: Object where keys are dates (YYYY-MM-DD format) and values are arrays of NEO objects

### Near-Earth Object Fields

- **id** / **neo_reference_id**: Unique identifier for the asteroid
- **name**: Official designation and discovery information
- **nasa_jpl_url**: Link to NASA's JPL Small-Body Database for detailed information
- **absolute_magnitude_h**: Brightness measurement (lower = brighter/larger)
- **estimated_diameter**: Size estimates in multiple units (kilometers, meters, miles, feet)
- **is_potentially_hazardous_asteroid**: Boolean indicating if the asteroid is classified as potentially hazardous (based on size and orbit)
- **close_approach_data**: Array of close approach events (usually one per query)
- **is_sentry_object**: Boolean indicating if the object is on NASA's Sentry impact monitoring system

### Close Approach Data

Each close approach event contains:

- **close_approach_date**: Date of closest approach (YYYY-MM-DD)
- **close_approach_date_full**: Full timestamp with time
- **epoch_date_close_approach**: Unix timestamp in milliseconds
- **relative_velocity**: Speed of the asteroid relative to Earth in multiple units
- **miss_distance**: How far the asteroid will pass from Earth
  - `astronomical`: Distance in AU (Astronomical Units, 1 AU ≈ 150 million km)
  - `lunar`: Distance in lunar distances (1 LD ≈ 384,400 km)
  - `kilometers`: Distance in kilometers
  - `miles`: Distance in miles
- **orbiting_body**: The celestial body being orbited (typically "Earth")

## Important Notes

- The date range between `start_date` and `end_date` cannot exceed 7 days
- The API uses the asteroid's closest approach date as the key in `near_earth_objects`
- Distance measurements:
  - **1 AU (Astronomical Unit)** = ~150 million kilometers (Earth-Sun distance)
  - **1 LD (Lunar Distance)** = ~384,400 kilometers (Earth-Moon distance)
- An asteroid is classified as "Potentially Hazardous" if:
  - Its minimum orbit intersection distance with Earth is 0.05 AU or less
  - Its absolute magnitude is 22.0 or brighter (diameter of ~140 meters or larger)
- The `DEMO_KEY` has rate limits; for production use, get your own API key at [https://api.nasa.gov](https://api.nasa.gov)

# How the data is managed in the project

# About the project structure
