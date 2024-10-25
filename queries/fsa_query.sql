SELECT ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geojson
FROM (
SELECT geom
FROM canada_fsa
WHERE cfsauid = 'V7N'
) as record;


SELECT *
FROM (
	SELECT COUNT(report.status) as total_count, report.location, pos_count
	FROM report 
	--GROUP BY(report.location)
	LEFT JOIN  (
			SELECT COUNT(report.status) as pos_count, report.location
			FROM report
			WHERE status = '+'
			group by(report.location)
		) as pos
		ON report.location = pos.location
	group by(report.location)
	)

SELECT pos_count, neg_count, symp_count, recov_count, postal, ST_AsGeoJSON(ST_Transform(canada_fsa.geom, 4326)) as geojson
FROM (
	SELECT postal
		, COUNT(*) FILTER (WHERE status = '+') AS pos_count
		, COUNT(*) FILTER (WHERE status = '-') AS neg_count
		, COUNT(*) FILTER (WHERE status = 's') AS symp_count
		, COUNT(*) FILTER (WHERE status = '=') AS recov_count
	FROM report
	WHERE report.active = true
	GROUP BY postal
) AS counts
right JOIN canada_fsa ON canada_fsa.cfsauid=counts.postal
WHERE canada_fsa.prname like '%British%'
order by st_distance(ST_Centroid(ST_Transform(
(SELECT geom FROM canada_fsa WHERE cfsauid = 'V7N'), 4326)), 
ST_Centroid(ST_Transform(canada_fsa.geom, 4326))) asc limit 5

SELECT cfsauid, ST_AsGeoJSON(ST_Transform(canada_fsa.geom, 4326)) as geojson 
FROM canada_fsa
WHERE prname like '%British%'
order by st_distance(ST_Centroid(ST_Transform(
(SELECT geom FROM canada_fsa WHERE cfsauid = 'V7N'), 4326)), 
ST_Centroid(ST_Transform(canada_fsa.geom, 4326))) asc limit 8


SELECT COUNT(report.status), report.postal, cfsauid, ST_AsGeoJSON(ST_Transform(canada_fsa.geom, 4326)) as geojson 
FROM canada_fsa
JOIN report ON canada_fsa.cfsauid=report.postal AND report.active = true 
Group by report.postal, cfsauid, canada_fsa.geom
order by st_distance(ST_Centroid(ST_Transform(
(SELECT geom FROM canada_fsa WHERE cfsauid = 'V8P'), 4326)), 
ST_Centroid(ST_Transform(canada_fsa.geom, 4326))) asc limit 5









