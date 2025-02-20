# Grafana and GCP
## Google Cloud Monitoring

It is possible to get metrics from a Google Cloud project by the use of the Grafana data source “Google Cloud Monitoring”.

![Example query Google Cloud Monitoring Logging Service](images/grafana_googlecloudquery.png)

Through the use of this data source, you will be able to see all metrics that are exposed through different Google Cloud services, such as CloudSQL, BigQuery, CloudKMS, Logging etc. This can then be added to your dashboards and alarms.

### Setting up the data source

While the data source is present, it will not scrape all projects in the Kartverket organisation in GCP by default. As of writing this (13 Oct 2023), SKIP does not facilitate this setup in any particular way, but you are free to do it the “SKIP way”.

To add your GCP project to the list of projects, simply add the GCP role `monitoring.viewer` to the Google Service Account `grafana-scraper@kubernetes-0dca.iam.gserviceaccount.com`. It should look like the below image.

![How IAM for the SA should look after adding the correct role](images/google_grafana_iam.png)

Remember that if you do not have access to editing IAM for your projects by default, you can always elevate your access using [JIT Access](https://jit.skip.kartverket.no/) .

Note that the setup for this may change in the future as this feature is somewhat unexplored as of writing this documentation.
