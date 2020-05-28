select COUNT(distinct user_id)
from report
where status = '+' and UPPER(location) like '%V7N%'

select distinct (user_id), count(user_id) from report
where status = '+' and UPPER(location) like '%V7N%';
