-- Refine DREM labels to distinguish business establishments from legal enterprises and add more 2025 housing/construction indicators.
update public.island_construction_indicators
set metric_key='non_financial_establishments_total',
    metric_label='Establishments of non-financial enterprises',
    notes='Regional total of establishments, not a count of distinct legal enterprises.'
where metric_key='non_financial_enterprises_total';
update public.island_construction_indicators
set metric_label='Persons employed in non-financial enterprise establishments',
    notes='Regional total; establishment-based measure.'
where metric_key='enterprise_employment_total';
update public.island_construction_indicators
set metric_label='Turnover of non-financial enterprise establishments',
    notes='Rounded regional total; establishment-based measure.'
where metric_key='enterprise_turnover_total';
update public.island_construction_indicators
set metric_label='Growth in number of non-financial enterprise establishments'
where metric_key='enterprise_count_growth_pct';
update public.island_construction_indicators
set metric_label=replace(metric_label,'Enterprise count growth','Establishment count growth')
where metric_key='municipal_enterprise_growth_pct';

update public.island_sources
set update_note='Municipality-linked directory. The portal currently reports 499 pre-registered businesses, including 86 restaurants, 153 construction/industry and 50 commerce/services. MADEIRA AI has imported an initial batch of 35. Pre-registration is not independent proof of current activity.'
where id='machico-business-directory';
update public.island_sources
set update_note='Official municipal land bank for cultivation and primary-sector opportunities in Ponta do Sol, Canhas and Madalena do Mar. This is not a residential building-plot feed; verify each offer and land-use conditions.'
where id='ponta-do-sol-land-bank';
update public.island_sources
set update_note='Municipal business directory categories include accommodation, real estate, construction, retail, restaurants, health, transport and tourism. Listing details and current activity require direct verification.'
where id='ponta-do-sol-business-directory';

insert into public.island_construction_indicators
(municipality_id,metric_key,segment,metric_label,metric_value,unit,reference_year,comparison_period,source_id,source_url,notes)
values
(null,'completed_buildings','','Buildings completed',404,'buildings',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional estimate; +9.8% compared with 2024.'),
(null,'completed_buildings_growth_pct','','Growth in buildings completed',9.8,'percent',2025,'2025 vs 2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional estimate.'),
(null,'completed_dwellings_growth_pct','','Change in dwellings completed',-12.0,'percent',2025,'2025 vs 2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional estimate.'),
(null,'licensed_buildings_growth_pct','','Change in buildings licensed',-6.5,'percent',2025,'2025 vs 2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional estimate.'),
(null,'licensed_dwellings_growth_pct','','Change in dwellings licensed',-7.7,'percent',2025,'2025 vs 2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional estimate.'),
(null,'dwelling_transactions_growth_pct','','Change in dwelling transactions',-13.5,'percent',2025,'2025 vs 2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional estimate.'),
(null,'dwelling_sale_median_growth_pct','','Change in median dwelling sale price',4.4,'percent',2025,'2025 vs 2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional median change.'),
(null,'bank_valuation_median_growth_pct','','Change in median bank housing appraisal',18.1,'percent',2025,'2025 vs 2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional median change.'),
(null,'dwelling_rent_median_previous_year','','Median rent in new residential contracts (previous year)',10.61,'eur_per_m2',2024,'2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional median for comparison with 2025 value.'),
(null,'cement_sales_growth_pct','','Change in cement sales',-5.4,'percent',2025,'2025 vs 2024','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional estimate.'),
(null,'cement_sales_value_m_eur','','Value of cement sold',25.3,'million_eur',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional estimate.'),
(null,'construction_work_value_growth_pct','','Growth in value of construction work',18.7,'percent',2024,'2024 vs 2023','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional total for construction enterprises headquartered in Madeira.'),
(null,'licensed_dwellings_per_building_avg','','Average licensed dwellings per building',2.5,'dwellings_per_building',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional average; 1.7 in 2011.'),
(null,'licensed_dwellings_per_floor_avg','','Average licensed dwellings per floor',1.1,'dwellings_per_floor',2025,'2025','drem-construction-housing-statistics','https://estatistica.madeira.gov.pt/en/download-now-3/economic/const-hab-gb/general-information-construction/press-release-construction/5990-23-09-2026-construcao-en.html','Regional average; 0.7 in 2011.')
on conflict do nothing;
