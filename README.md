# Bypass

This add-on bypasses tracking host and redirect to the URL linked in the query parameter. For instance, executing the add-on on `https://www.tracking_host.com/track?id=123&origin=www.google.com&url=https%3A%2F%2Fwww.actual_host.com%2Fuseful_page` redirects to `https://www.actual_host.com/useful_page`.

This only works if some ad blocker or DNS blocker blocks www.tracking_host.com, leaving an error page.
