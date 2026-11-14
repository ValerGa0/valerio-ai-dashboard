update public.island_directory_entries
set municipality_id='santa-cruz',parish='Caniço',
    description='Tourist-entertainment operator listed in the official Visit Madeira directory. RNAAT 549/2021. Address is in Caniço (Santa Cruz municipality).'
where external_key='ponta-do-sol:luis-leonel-david';
update public.island_directory_entries
set municipality_id='sao-vicente',parish='São Vicente',
    description='Tourist-entertainment operator listed in the official Visit Madeira directory. RNAAT 960/2022. Address is in São Vicente municipality.'
where external_key='ponta-do-sol:luis-mateus-gouveia';
update public.island_directory_entries
set municipality_id='funchal',parish='Funchal',
    description='Tourist-entertainment operator listed in the official Visit Madeira directory. RNAAT 30/2026. The listed address is in Funchal, not Calheta.'
where external_key='calheta:madeira-waves';
update public.island_directory_entries
set phone=null
where external_key='calheta:michael-jordan';
