# install required packages -----------------------------------------------


##install required packages auto-detect/install required packages

list.of.packages <- c('tidyverse','magrittr','tidycensus','htmltab','reshape2','tigris','readxl','hablar','sf','htmltools','','','','','','','')


new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
if(length(new.packages)) install.packages(new.packages)

rm(list.of.packages, new.packages)

# collect data ------------------------------------------------------------

library(tidyverse)
library(magrittr)
library(tidycensus)
library(htmltab)
library(reshape2)
library(tigris)
library(readxl)
library(hablar)
library(sf)
library(htmltools)
library(htmlwidgets)
library(geojsonio)


# insert your census api key below -- Get one at:
# http://api.census.gov/data/key_signup.html

census_api_key(key = '3c92b89c452f8f39004686f5726c9b528a3bc51f', install = TRUE, overwrite = TRUE)
readRenviron("~/.Renviron")

# https://www.dshs.texas.gov/chs/popdat/downloads.shtm


# collect variables  -----------------------------------------------------------

library(totalcensus)

sf1_2000_variables_derb <- load_variables(2000, 'sf1', cache = TRUE)
sf3_2000_variables_derb <- load_variables(2000, 'sf3', cache = TRUE)
sf1_2010_variables_derb <- load_variables(2010, 'sf1', cache = TRUE)

library(tidycensus)

#### sf1 

sf1_variables <- as.data.frame.vector(c('OCCUPANCY STATUS:Housing Units:Total', 
                                        'OCCUPANCY STATUS:Housing Units:Occupied',
                                        'OCCUPANCY STATUS:Housing Units:Vacant',
                                        'Vacant Housing Units:Total',
                                        'RACE:Total',
                                        'RACE:Total one race',
                                        'RACE:White alone',
                                        'RACE:Black/AfAmer alone',
                                        'RACE:AmInd/Alaskn alone',
                                        'RACE:Asian alone',
                                        'RACE:HI alone',
                                        'RACE:Some other race alone',
                                        'HISPANIC:Total Hispanic & NotHispanic',
                                        'HISPANIC:Total Hispanic or Latino',
                                        'HISPANIC:Total notHispanic or Latino'), nm = paste(deparse(substitute(name))))
sf1_variables$variable <-c('H003001',
                           'H003002',
                           'H003003',
                           'H005001',
                           'P003001',
                           'P003002',
                           'P003003',
                           'P003004',
                           'P003005',
                           'P003006',
                           'P003007',
                           'P003008',
                           'P003009',
                           'P003010',
                           'P004001',
                           'P004002',
                           'P004003')

#### sf3

sf3_variables <- data.frame('name' = c('Total: Households',
                                       'Total:  English',
                                       'Total:  Spanish:  Linguistically isolated',
                                       'Total:  Spanish:  Not linguistically isolated',
                                       'Total: Population for whom poverty status is determined',
                                       'Total:  Under .50',
                                       'Total:  50 to .74',
                                       'Total:  75 to .99	',
                                       'Total:  1.00 to 1.24	',
                                       'Total:  1.25 to 1.49',
                                       'Total:  1.50 to 1.74',
                                       'Total:  1.75 to 1.84',
                                       'Total:  1.85 to 1.99',
                                       'Total:  2.00 and over',
                                       'Total: Population 25 years and over',
                                       'Total:  Male:',
                                       'Total:  Male:  No schooling completed',
                                       'Total:  Male:  High school graduate (includes equivalency)',
                                       'Total:  Male:  Some college, 1 or more years, no degree',
                                       'Total:  Male:  Associate degree',
                                       "Total:  Male:  Bachelor's degree",
                                       "Total:  Male:  Master's degree",
                                       "Total:  Male:  Professional school degree",
                                       "Total:  Male:  Doctorate degree",
                                       'Total:  Female:',
                                       'Total:  Female:  No schooling completed',
                                       'Total:  Female:  High school graduate (includes equivalency)',
                                       'Total:  Female:  Some college, 1 or more years, no degree',
                                       'Total:  Female:  Associate degree',
                                       "Total:  Female:  Bachelor's degree",
                                       "Total:  Female:  Master's degree",
                                       'Total:  Female:  Professional school degree',
                                       'Total:  Female:  Doctorate degree',
                                       'Total:  Less than $10,000',
                                       'Total:  $10,000 to $19,999	',
                                       'Total:  $20,000 to $34,999:',
                                       'Total:  $35,000 to $49,999:',
                                       'Total:  $50,000 to $74,999:',
                                       'Total:  $75,000 to $99,999:',
                                       'Total:  $100,000 or more:'),
                            'variable' = c('P020001',
                                           'P020002',
                                           'P020004',
                                           'P020005',
                                           'P088001',
                                           'P088002',
                                           'P088003',
                                           'P088004',
                                           'P088005',
                                           'P088006',
                                           'P088007',
                                           'P088008',
                                           'P088009',
                                           'P088010',
                                           'P037001',
                                           'P037002',
                                           'P037003',
                                           'P037011',
                                           'P037013',
                                           'P037014',
                                           'P037015',
                                           'P037016',
                                           'P037017',
                                           'P037018',
                                           'P037019',
                                           'P037020',
                                           'P037028',
                                           'P037030',
                                           'P037031',
                                           'P037032',
                                           'P037033',
                                           'P037034',
                                           'P037035',
                                           'H097002',
                                           'H073009',
                                           'H073016',
                                           'H073023',
                                           'H073030',
                                           'H073037',
                                           'H073044'))

#### acs5

acs5_variables <- as.data.frame.vector(c('Estimate!!EDUCATIONAL ATTAINMENT!!Population 25 years and over',
                                         'Estimate!!EDUCATIONAL ATTAINMENT!!Less than 9th grade',
                                         'Estimate!!EDUCATIONAL ATTAINMENT!!High school graduate (includes equivalency)	',
                                         'Estimate!!EDUCATIONAL ATTAINMENT!!Some college, no degree	',
                                         "Estimate!!EDUCATIONAL ATTAINMENT!!Associate's degree",
                                         "Estimate!!EDUCATIONAL ATTAINMENT!!Bachelor's degree",
                                         'Estimate!!EDUCATIONAL ATTAINMENT!!Graduate or professional degree',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!Population 5 years and over',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!English only',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!Language other than English!!Spanish',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!Language other than English!!Spanish!!Speak English less than "very well"',
                                         'Less than $10,000',
                                         '$10,000 to $14,999',
                                         '$15,000 to $24,999',
                                         '$25,000 to $34,999',
                                         '$35,000 to $49,999',
                                         '$50,000 to $74,999',
                                         '$75,000 to $99,999',
                                         '$100,000 to $149,999',
                                         '$150,000 to $199,999',
                                         '$200,000 or more',
                                         'With Supplemental Security Income',
                                         'With cash public assistance income',
                                         'With Food Stamp/SNAP benefits in the past 12 months'), 
                                       nm = paste(deparse(substitute(name))))

acs5_variables$variable <- c('DP02_0058E',
                             'DP02_0059E',
                             'DP02_0061E',
                             'DP02_0062E',
                             'DP02_0063E',
                             'DP02_0064E',
                             'DP02_0065E',
                             'DP02_0110E',
                             'DP02_0111E',
                             'DP02_0114E',
                             'DP02_0115E',
                             'DP03_0076E',
                             'DP03_0077E',
                             'DP03_0078E',
                             'DP03_0080E',
                             'DP03_0081E',
                             'DP03_0082E',
                             'DP03_0083E',
                             'DP03_0084E',
                             'DP03_0085E',
                             'DP03_0070PE',
                             'DP03_0072PE',
                             'DP03_0074PE',
                             'DP03_0073PE')


acs5_race <- as.data.frame.vector(c('Estimate!!RACE!!Total population',
                                    'Estimate!!RACE!!One race',
                                    'Estimate!!RACE!!Two or more races',
                                    'Estimate!!RACE!!One race!!White',
                                    'Estimate!!RACE!!One race!!Black or African American',
                                    'Estimate!!RACE!!One race!!American Indian and Alaska Native',
                                    'Estimate!!RACE!!One race!!Asian',
                                    'Estimate!!RACE!!One race!!Asian!!Asian Indian',
                                    'Estimate!!RACE!!One race!!Native Hawaiian and Other Pacific Islander',
                                    'Estimate!!RACE!!One race!!Some other race',
                                    'Estimate!!HISPANIC OR LATINO AND RACE!!Total population	',
                                    'Estimate!!HISPANIC OR LATINO AND RACE!!Hispanic or Latino (of any race)'), nm = paste(deparse(substitute(name))))

acs5_race$variable <- c('DP05_0028E',
                        'DP05_0029E',
                        'DP05_0030E',
                        'DP05_0032E',
                        'DP05_0033E',
                        'DP05_0034E',
                        'DP05_0039E',
                        'DP05_0040E',
                        'DP05_0047E',
                        'DP05_0052E',
                        'DP05_0065E',
                        'DP05_0066E')


# download stats and geography --------------------------------------------


# sf1

sf1_variables %<>%
  mutate(ad2000 = 0,
         ad2010 = 0)

sf1_variables <- as.data.frame(sf1_variables)

sf1_variables <- sf1_variables[-c(13,14),]

for(i in 1:nrow(sf1_variables)){
  
  sf1_variables$ad2010[[i]] <- nest(get_decennial(geography = "tract",
                                                  c(paste0(sf1_variables$variable[[i]])),
                                                  state = "TX",
                                                  county = "BEXAR",
                                                  geometry = TRUE,
                                                  year = 2010,
                                                  sumfile = 'sf1',
                                                  output = 'tidy',
                                                  cache_table = TRUE))
}


for(i in 1:nrow(sf1_variables)){
  
  sf1_variables$ad2000[[i]] <- nest(get_decennial(geography = "tract",
                                                  c(paste0(sf1_variables$variable[[i]])),
                                                  state = "TX",
                                                  county = "BEXAR",
                                                  geometry = TRUE,
                                                  year = 2000,
                                                  sumfile = 'sf1',
                                                  output = 'tidy',
                                                  cache_table = TRUE))
}

#### sf3

sf3_variables %<>%
  mutate(ad2000 = 0)


for(i in 1:nrow(sf3_variables)){
  
  sf3_variables$ad2000[[i]] <- nest(get_decennial(geography = "tract",
                                                  c(paste0(sf3_variables$variable[[i]])),
                                                  state = "TX",
                                                  county = "BEXAR",
                                                  geometry = TRUE,
                                                  year = 2000,
                                                  sumfile = 'sf3',
                                                  output = 'tidy',
                                                  cache_table = TRUE))
}


#### acs5 

acs5_variables %<>%
  mutate(ad2010 = 0,
         ad2011 = 0,
         ad2012 = 0,
         ad2013 = 0,
         ad2014 = 0,
         ad2015 = 0,
         ad2016 = 0,
         ad2017 = 0)

for(i in 1:nrow(acs5_variables)){
  
  acs5_variables$ad2010[[i]] <- nest(get_acs(geography = "tract",
                                             c(paste0(acs5_variables$variable[[i]])),
                                             state = "TX",
                                             county = "BEXAR",
                                             geometry = TRUE,
                                             year = 2010,
                                             output = 'tidy',
                                             cache_table = TRUE))
}

for(i in 1:nrow(acs5_variables)){
  
  acs5_variables$ad2011[[i]] <- nest(get_acs(geography = "tract",
                                             c(paste0(acs5_variables$variable[[i]])),
                                             state = "TX",
                                             county = "BEXAR",
                                             geometry = TRUE,
                                             year = 2011,
                                             output = 'tidy',
                                             cache_table = TRUE))
}

for(i in 1:nrow(acs5_variables)){
  
  acs5_variables$ad2012[[i]] <- nest(get_acs(geography = "tract",
                                             c(paste0(acs5_variables$variable[[i]])),
                                             state = "TX",
                                             county = "BEXAR",
                                             geometry = TRUE,
                                             year = 2012,
                                             output = 'tidy',
                                             cache_table = TRUE))
}

for(i in 1:nrow(acs5_variables)){
  
  acs5_variables$ad2013[[i]] <- nest(get_acs(geography = "tract",
                                             c(paste0(acs5_variables$variable[[i]])),
                                             state = "TX",
                                             county = "BEXAR",
                                             geometry = TRUE,
                                             year = 2013,
                                             output = 'tidy',
                                             cache_table = TRUE))
}

for(i in 1:nrow(acs5_variables)){
  
  acs5_variables$ad2014[[i]] <- nest(get_acs(geography = "tract",
                                             c(paste0(acs5_variables$variable[[i]])),
                                             state = "TX",
                                             county = "BEXAR",
                                             geometry = TRUE,
                                             year = 2014,
                                             output = 'tidy',
                                             cache_table = TRUE))
}

for(i in 1:nrow(acs5_variables)){
  
  acs5_variables$ad2015[[i]] <- nest(get_acs(geography = "tract",
                                             c(paste0(acs5_variables$variable[[i]])),
                                             state = "TX",
                                             county = "BEXAR",
                                             geometry = TRUE,
                                             year = 2015,
                                             output = 'tidy',
                                             cache_table = TRUE))
}


for(i in 1:nrow(acs5_variables)){
  
  acs5_variables$ad2016[[i]] <- nest(get_acs(geography = "tract",
                                             c(paste0(acs5_variables$variable[[i]])),
                                             state = "TX",
                                             county = "BEXAR",
                                             geometry = TRUE,
                                             year = 2016,
                                             output = 'tidy',
                                             cache_table = TRUE))
}

for(i in 1:nrow(acs5_variables)){
  
  acs5_variables$ad2017[[i]] <- nest(get_acs(geography = "tract",
                                             c(paste0(acs5_variables$variable[[i]])),
                                             state = "TX",
                                             county = "BEXAR",
                                             geometry = TRUE,
                                             year = 2017,
                                             output = 'tidy',
                                             cache_table = TRUE))
}

acs5_race %<>%
  mutate(ad2010 = 0,
         ad2011 = 0,
         ad2012 = 0,
         ad2013 = 0,
         ad2014 = 0,
         ad2015 = 0,
         ad2016 = 0,
         ad2017 = 0)


for(i in 1:nrow(acs5_race)){
  
  acs5_race$ad2010[[i]] <- nest(get_acs(geography = "tract",
                                        c(paste0(acs5_race$variable[[i]])),
                                        state = "TX",
                                        county = "BEXAR",
                                        geometry = TRUE,
                                        year = 2010,
                                        output = 'tidy',
                                        cache_table = TRUE))
}

for(i in 1:nrow(acs5_race)){
  
  acs5_race$ad2011[[i]] <- nest(get_acs(geography = "tract",
                                        c(paste0(acs5_race$variable[[i]])),
                                        state = "TX",
                                        county = "BEXAR",
                                        geometry = TRUE,
                                        year = 2011,
                                        output = 'tidy',
                                        cache_table = TRUE))
}

for(i in 1:nrow(acs5_race)){
  
  acs5_race$ad2012[[i]] <- nest(get_acs(geography = "tract",
                                        c(paste0(acs5_race$variable[[i]])),
                                        state = "TX",
                                        county = "BEXAR",
                                        geometry = TRUE,
                                        year = 2012,
                                        output = 'tidy',
                                        cache_table = TRUE))
}

for(i in 1:nrow(acs5_race)){
  
  acs5_race$ad2013[[i]] <- nest(get_acs(geography = "tract",
                                        c(paste0(acs5_race$variable[[i]])),
                                        state = "TX",
                                        county = "BEXAR",
                                        geometry = TRUE,
                                        year = 2013,
                                        output = 'tidy',
                                        cache_table = TRUE))
}

for(i in 1:nrow(acs5_race)){
  
  acs5_race$ad2014[[i]] <- nest(get_acs(geography = "tract",
                                        c(paste0(acs5_race$variable[[i]])),
                                        state = "TX",
                                        county = "BEXAR",
                                        geometry = TRUE,
                                        year = 2014,
                                        output = 'tidy',
                                        cache_table = TRUE))
}

for(i in 1:nrow(acs5_race)){
  
  acs5_race$ad2015[[i]] <- nest(get_acs(geography = "tract",
                                        c(paste0(acs5_race$variable[[i]])),
                                        state = "TX",
                                        county = "BEXAR",
                                        geometry = TRUE,
                                        year = 2015,
                                        output = 'tidy',
                                        cache_table = TRUE))
}


for(i in 1:nrow(acs5_race)){
  
  acs5_race$ad2016[[i]] <- nest(get_acs(geography = "tract",
                                        c(paste0(acs5_race$variable[[i]])),
                                        state = "TX",
                                        county = "BEXAR",
                                        geometry = TRUE,
                                        year = 2016,
                                        output = 'tidy',
                                        cache_table = TRUE))
}

for(i in 1:nrow(acs5_race)){
  
  acs5_race$ad2017[[i]] <- nest(get_acs(geography = "tract",
                                        c(paste0(acs5_race$variable[[i]])),
                                        state = "TX",
                                        county = "BEXAR",
                                        geometry = TRUE,
                                        year = 2017,
                                        output = 'tidy',
                                        cache_table = TRUE))
}


# unnesting related variables ---------------------------------------------

#### sf1

tmp1 <- unnest(sf1_variables$ad2000[[1]], cols = c('data')) %>%
  rename('ad2000' = 'value', 'geo_2000' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

tmp2 <- unnest(sf1_variables$ad2010[[1]], cols = c('data')) %>%
  rename('ad2010' = 'value', 'geo_2010' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(sf1_variables)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(sf1_variables$ad2000[[i]], cols = c('data')) %>%
                      rename('ad2000' = 'value', 'geo_2000' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  tmp2 <- bind_rows(tmp2, 
                    unnest(sf1_variables$ad2010[[i]], cols = c('data')) %>%
                      rename('ad2010' = 'value', 'geo_2010' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
}

sf1_interpolated <- merge(tmp1, tmp2, by = c('GEOID','NAME', 'variable'), all = TRUE)

sf1_interpolated %<>%
  select(GEOID,NAME,variable, ad2000, ad2010) %>%
  mutate(ad2001 = round(ad2000 + ((ad2010 - ad2000)*.10), digits = 0),
         ad2002 = round(ad2000 + ((ad2010 - ad2000)*.20), digits = 0),
         ad2003 = round(ad2000 + ((ad2010 - ad2000)*.30), digits = 0),
         ad2004 = round(ad2000 + ((ad2010 - ad2000)*.40), digits = 0),
         ad2005 = round(ad2000 + ((ad2010 - ad2000)*.50), digits = 0),
         ad2006 = round(ad2000 + ((ad2010 - ad2000)*.60), digits = 0),
         ad2007 = round(ad2000 + ((ad2010 - ad2000)*.70), digits = 0),
         ad2008 = round(ad2000 + ((ad2010 - ad2000)*.80), digits = 0),
         ad2009 = round(ad2000 + ((ad2010 - ad2000)*.90), digits = 0))

sf1_interpolated <- sf1_interpolated[, c(1,2,3,4,6,7,8,9,10,11,12,13,14,5)]

#### sf3

sf3_condensed <- unnest(sf3_variables$ad2000[[1]], cols = c('data')) %>%
  rename('ad2000' = 'value', 'geo_2000' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(sf3_variables)){
  
  tmp1 <- unnest(sf3_variables$ad2000[[i]], cols = c('data')) %>%
    rename('ad2000' = 'value', 'geo_2000' = 'geometry') %>%
    mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))
  
  sf3_condensed <- bind_rows(sf3_condensed, tmp1)
  
}

sf3_condensed %<>%
  select(-geo_2000)

sf3_condensed <- dcast(sf3_condensed, GEOID+NAME~variable, value.var = c('ad2000'))

sf3_condensed %<>%
  mutate(DP02_0058 = P037002 + P037019,
         DP02_0061 = P037011 + P037028,
         DP02_0062 = P037013 + P037030,
         DP02_0063 = P037014 + P037031,
         DP02_0064 = P037015 + P037032,
         DP02_0065 = P037016 + P037018 + P037033 + P037035,
         range_10k_34999 = H073009 + H073016)

sf3_condensed <- melt(sf3_condensed, id.vars = c('GEOID', 'NAME'), variable.name = c('variable'), value.name = c('ad2000'))

sf3_condensed %<>%
  convert(chr(NAME, variable),
          num(GEOID, ad2000))

#### unnest acs5

tmp1 <- 
  acs5_variables %>%
  select(name, variable, ad2010)

sf3_acs5_interpolation <- unnest(tmp1$ad2010[[1]], cols = c('data')) %>%
  rename('ad2010' = 'estimate', 'geo_2010' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(tmp1)){
  
  tmp2 <-unnest(tmp1$ad2010[[i]], cols = c('data')) %>%
    rename('ad2010' = 'estimate', 'geo_2010' = 'geometry') %>%
    mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))
  
  sf3_acs5_interpolation <- bind_rows(sf3_acs5_interpolation, tmp2)
  
}

sf3_acs5_interpolation %<>%
  select(-geo_2010,-moe)

sf3_acs5_interpolation <- dcast(sf3_acs5_interpolation, GEOID+NAME~variable, value.var = c('ad2010'))

sf3_acs5_interpolation %<>%
  mutate(range_10k_34999 = DP03_0077 + DP03_0078 + DP03_0080)

sf3_acs5_interpolation <- melt(sf3_acs5_interpolation, id.vars = c('GEOID', 'NAME'), variable.name = c('variable'), value.name = c('ad2010'))

sf3_condensed %<>%
  select(-GEOID)

sf3_acs5_interpolation %<>%
  select(-GEOID)

sf3_acs5_interpolation <- retype(sf3_acs5_interpolation)
sf3_condensed <- retype(sf3_condensed)

sf3_acs5_interpolation_test <- merge(sf3_condensed, sf3_acs5_interpolation, by = c('NAME','variable'), all = TRUE)

sf3_acs5_interpolation_test %<>%
  filter(str_detect(variable, 'DP02')| str_detect(variable, 'range_')) %>%
  mutate(ad2001 = round(ad2000 + ((ad2010 - ad2000)*.10), digits = 0),
         ad2002 = round(ad2000 + ((ad2010 - ad2000)*.20), digits = 0),
         ad2003 = round(ad2000 + ((ad2010 - ad2000)*.30), digits = 0),
         ad2004 = round(ad2000 + ((ad2010 - ad2000)*.40), digits = 0),
         ad2005 = round(ad2000 + ((ad2010 - ad2000)*.50), digits = 0),
         ad2006 = round(ad2000 + ((ad2010 - ad2000)*.60), digits = 0),
         ad2007 = round(ad2000 + ((ad2010 - ad2000)*.70), digits = 0),
         ad2008 = round(ad2000 + ((ad2010 - ad2000)*.80), digits = 0),
         ad2009 = round(ad2000 + ((ad2010 - ad2000)*.90), digits = 0))

sf3_acs5_interpolation_test <- sf3_acs5_interpolation_test[,c(1,2,3,5,6,7,8,9,10,11,12,13,4)]


# combine sf3 with acs5 ---------------------------------------------------

sf3_acs5_interpolation_test <- merge(sf3_acs5_interpolation_test, sf1_interpolated[,c(1,2)] %>% distinct(), by = c('NAME'))

range_2000_2010 <- bind_rows(sf1_interpolated, sf3_acs5_interpolation_test)


# make separate geography and stats dataframes  ---------------------------

##### 2000 - 2010

## get sf1/sf3/acs geographies

library(tigris)

geo_2000 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2000)
geo_2001 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2001)
geo_2002 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2002)
geo_2003 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2003)
geo_2004 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2004)
geo_2005 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2005)
geo_2006 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2006)
geo_2007 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2007)
geo_2008 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2008)
geo_2009 <- tracts(state = 48, county = 029, cb = TRUE, year = 2000, class = 'sf') %>% mutate(year = 2009)
geo_2010 <- tracts(state = 48, county = 029, cb = TRUE, year = 2010, class = 'sf') %>% mutate(year = 2010)
geo_2011 <- tracts(state = 48, county = 029, cb = TRUE, year = 2010, class = 'sf') %>% mutate(year = 2011)
geo_2012 <- tracts(state = 48, county = 029, cb = TRUE, year = 2010, class = 'sf') %>% mutate(year = 2012)
geo_2013 <- tracts(state = 48, county = 029, cb = TRUE, year = 2013, class = 'sf') %>% mutate(year = 2013)
geo_2014 <- tracts(state = 48, county = 029, cb = TRUE, year = 2014, class = 'sf') %>% mutate(year = 2014)
geo_2015 <- tracts(state = 48, county = 029, cb = TRUE, year = 2015, class = 'sf') %>% mutate(year = 2015)
geo_2016 <- tracts(state = 48, county = 029, cb = TRUE, year = 2016, class = 'sf') %>% mutate(year = 2016)
geo_2017 <- tracts(state = 48, county = 029, cb = TRUE, year = 2017, class = 'sf') %>% mutate(year = 2017)

geos<- bind_rows(geo_2000, geo_2001, 
                 geo_2002, geo_2003, 
                 geo_2004, geo_2005,
                 geo_2006, geo_2007,
                 geo_2008, geo_2009,
                 geo_2010, geo_2011,
                 geo_2012, geo_2013,
                 geo_2014, geo_2015,
                 geo_2016, geo_2017)


# merge stats with geography ----------------------------------------------

sf3_acs5_interpolation_test <- merge(sf3_acs5_interpolation_test, sf1_interpolated %>%
                                       select(GEOID, NAME) %>%
                                       distinct(), by = c('GEOID', 'NAME'), all.x = TRUE)

sf3_acs5_interpolation_test %<>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract '))

sf1_interpolated %<>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract '))

testo <- bind_rows(sf3_acs5_interpolation_test %>% select(GEOID,NAME,variable,ad2000), sf1_interpolated %>% select(GEOID,NAME,variable,ad2000))

geo_2000_stats <- merge(geo_2000, 
                        testo, 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

geo_2000_stats <- spread(geo_2000_stats, variable, ad2000)


# repeat 'ad2000' through 2010 --------------------------------------------

for(i in 1:9){

  tmp1 <- bind_rows(sf3_acs5_interpolation_test %>% select(GEOID,NAME,variable, paste0('ad200', i)), sf1_interpolated %>% select(GEOID,NAME,variable,paste0('ad200', i)))
  
  tmp2 <- assign(paste0('geo_200',i,'_stats'), merge(get(paste0('geo_200',i)), 
                          tmp1, 
                          by.x = c('TRACT', 'NAME'), 
                          by.y = c('GEOID', 'NAME')))
  
  assign(paste0('geo_200',i,'_stats'), spread(tmp2, variable, paste0('ad200',i)))
  
}


# acs5 for 2010+ ----------------------------------------------------------


### 2010

tmp1 <- unnest(acs5_variables$ad2010[[1]], cols = c('data')) %>%
  rename('ad2010' = 'estimate', 'geo_2010' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_variables)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_variables$ad2010[[i]], cols = c('data')) %>%
                      rename('ad2010' = 'estimate', 'geo_2010' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))

   }

acs_unnest_2010 <- tmp1

geo_2010_stats <- acs_unnest_2010 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2010)

geo_2010_stats <- merge(geo_2010, 
                        geo_2010_stats %>%
                          select(-geo_2010), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2011

tmp1 <- unnest(acs5_variables$ad2011[[1]], cols = c('data')) %>%
  rename('ad2011' = 'estimate', 'geo_2011' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_variables)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_variables$ad2011[[i]], cols = c('data')) %>%
                      rename('ad2011' = 'estimate', 'geo_2011' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2011 <- tmp1

geo_2011_stats <- acs_unnest_2011 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2011)

geo_2011_stats <- merge(geo_2011, 
                        geo_2011_stats %>%
                          select(-geo_2011), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2012

tmp1 <- unnest(acs5_variables$ad2012[[1]], cols = c('data')) %>%
  rename('ad2012' = 'estimate', 'geo_2012' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_variables)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_variables$ad2012[[i]], cols = c('data')) %>%
                      rename('ad2012' = 'estimate', 'geo_2012' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2012 <- tmp1

geo_2012_stats <- acs_unnest_2012 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2012)

geo_2012_stats <- merge(geo_2012, 
                        geo_2012_stats %>%
                          select(-geo_2012), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2013

tmp1 <- unnest(acs5_variables$ad2013[[1]], cols = c('data')) %>%
  rename('ad2013' = 'estimate', 'geo_2013' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_variables)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_variables$ad2013[[i]], cols = c('data')) %>%
                      rename('ad2013' = 'estimate', 'geo_2013' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2013 <- tmp1

geo_2013_stats <- acs_unnest_2013 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2013)

geo_2013_stats <- merge(geo_2013 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2013_stats %>%
                          select(-geo_2013), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2014

tmp1 <- unnest(acs5_variables$ad2014[[1]], cols = c('data')) %>%
  rename('ad2014' = 'estimate', 'geo_2014' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_variables)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_variables$ad2014[[i]], cols = c('data')) %>%
                      rename('ad2014' = 'estimate', 'geo_2014' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2014 <- tmp1

geo_2014_stats <- acs_unnest_2014 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2014)

geo_2014_stats <- merge(geo_2014 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2014_stats %>%
                          select(-geo_2014), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2015

tmp1 <- unnest(acs5_variables$ad2015[[1]], cols = c('data')) %>%
  rename('ad2015' = 'estimate', 'geo_2015' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_variables)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_variables$ad2015[[i]], cols = c('data')) %>%
                      rename('ad2015' = 'estimate', 'geo_2015' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2015 <- tmp1

geo_2015_stats <- acs_unnest_2015 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2015)

geo_2015_stats <- merge(geo_2015 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2015_stats %>%
                          select(-geo_2015), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2016

tmp1 <- unnest(acs5_variables$ad2016[[1]], cols = c('data')) %>%
  rename('ad2016' = 'estimate', 'geo_2016' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_variables)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_variables$ad2016[[i]], cols = c('data')) %>%
                      rename('ad2016' = 'estimate', 'geo_2016' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2016 <- tmp1

geo_2016_stats <- acs_unnest_2016 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2016)

geo_2016_stats <- merge(geo_2016 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2016_stats %>%
                          select(-geo_2016), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2017

tmp1 <- unnest(acs5_variables$ad2017[[1]], cols = c('data')) %>%
  rename('ad2017' = 'estimate', 'geo_2017' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_variables)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_variables$ad2017[[i]], cols = c('data')) %>%
                      rename('ad2017' = 'estimate', 'geo_2017' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2017 <- tmp1

geo_2017_stats <- acs_unnest_2017 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2017)

geo_2017_stats <- merge(geo_2017 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2017_stats %>%
                          select(-geo_2017), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))


# acs5 race variables -----------------------------------------------------

### 2010

tmp1 <- unnest(acs5_race$ad2010[[1]], cols = c('data')) %>%
  rename('ad2010' = 'estimate', 'geo_2010' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_race)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_race$ad2010[[i]], cols = c('data')) %>%
                      rename('ad2010' = 'estimate', 'geo_2010' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2010 <- tmp1

geo_2010_race_stats <- acs_unnest_2010 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2010)

geo_2010_race_stats <- merge(geo_2010, 
                        geo_2010_race_stats %>%
                          select(-geo_2010), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2011

tmp1 <- unnest(acs5_race$ad2011[[1]], cols = c('data')) %>%
  rename('ad2011' = 'estimate', 'geo_2011' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_race)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_race$ad2011[[i]], cols = c('data')) %>%
                      rename('ad2011' = 'estimate', 'geo_2011' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2011 <- tmp1

geo_2011_race_stats <- acs_unnest_2011 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2011)

geo_2011_race_stats <- merge(geo_2011, 
                        geo_2011_race_stats %>%
                          select(-geo_2011), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2012

tmp1 <- unnest(acs5_race$ad2012[[1]], cols = c('data')) %>%
  rename('ad2012' = 'estimate', 'geo_2012' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_race)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_race$ad2012[[i]], cols = c('data')) %>%
                      rename('ad2012' = 'estimate', 'geo_2012' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2012 <- tmp1

geo_2012_race_stats <- acs_unnest_2012 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2012)

geo_2012_race_stats <- merge(geo_2012, 
                        geo_2012_race_stats %>%
                          select(-geo_2012), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2013

tmp1 <- unnest(acs5_race$ad2013[[1]], cols = c('data')) %>%
  rename('ad2013' = 'estimate', 'geo_2013' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_race)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_race$ad2013[[i]], cols = c('data')) %>%
                      rename('ad2013' = 'estimate', 'geo_2013' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2013 <- tmp1

geo_2013_race_stats <- acs_unnest_2013 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2013)

geo_2013_race_stats <- merge(geo_2013 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2013_race_stats %>%
                          select(-geo_2013), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2014

tmp1 <- unnest(acs5_race$ad2014[[1]], cols = c('data')) %>%
  rename('ad2014' = 'estimate', 'geo_2014' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_race)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_race$ad2014[[i]], cols = c('data')) %>%
                      rename('ad2014' = 'estimate', 'geo_2014' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2014 <- tmp1

geo_2014_race_stats <- acs_unnest_2014 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2014)

geo_2014_race_stats <- merge(geo_2014 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2014_race_stats %>%
                          select(-geo_2014), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2015

tmp1 <- unnest(acs5_race$ad2015[[1]], cols = c('data')) %>%
  rename('ad2015' = 'estimate', 'geo_2015' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_race)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_race$ad2015[[i]], cols = c('data')) %>%
                      rename('ad2015' = 'estimate', 'geo_2015' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2015 <- tmp1

geo_2015_race_stats <- acs_unnest_2015 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2015)

geo_2015_race_stats <- merge(geo_2015 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2015_race_stats %>%
                          select(-geo_2015), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2016

tmp1 <- unnest(acs5_race$ad2016[[1]], cols = c('data')) %>%
  rename('ad2016' = 'estimate', 'geo_2016' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_race)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_race$ad2016[[i]], cols = c('data')) %>%
                      rename('ad2016' = 'estimate', 'geo_2016' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2016 <- tmp1

geo_2016_race_stats <- acs_unnest_2016 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2016)

geo_2016_race_stats <- merge(geo_2016 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2016_race_stats %>%
                          select(-geo_2016), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

### 2017

tmp1 <- unnest(acs5_race$ad2017[[1]], cols = c('data')) %>%
  rename('ad2017' = 'estimate', 'geo_2017' = 'geometry') %>%
  mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+'))

for(i in 2:nrow(acs5_race)){
  
  tmp1 <- bind_rows(tmp1,
                    unnest(acs5_race$ad2017[[i]], cols = c('data')) %>%
                      rename('ad2017' = 'estimate', 'geo_2017' = 'geometry') %>%
                      mutate(NAME = str_extract(NAME, 'Census Tract [[0-9]]+.[[0-9]]+')))
  
}

acs_unnest_2017 <- tmp1

geo_2017_race_stats <- acs_unnest_2017 %>%
  select(-moe) %>%
  mutate(GEOID = str_remove(GEOID,'48029'),
         NAME = str_remove(NAME, 'Census Tract ')) %>%
  spread(., variable, ad2017)

geo_2017_race_stats <- merge(geo_2017 %>%
                          rename('TRACT' = 'TRACTCE'), 
                        geo_2017_race_stats %>%
                          select(-geo_2017), 
                        by.x = c('TRACT', 'NAME'), 
                        by.y = c('GEOID', 'NAME'))

# actually mapping --------------------------------------------------------

library(sf)
library(htmltools)
library(htmlwidgets)
library(geojsonio)

geojson_2000 <-
  geo_2000_stats %>%
  st_transform(crs = "+proj=longlat +datum=WGS84")

geojson_write(geojson_2000, file = 'geo_2000.geojson')

for(i in c(2001:2017)){
  
  assign(paste0('geojson_',i), get(paste0('geo_',i, '_stats')) %>%
           st_transform(crs = "+proj=longlat +datum=WGS84"))
  
  geojson_write(get(paste0('geojson_',i)), file = paste0('geo_',i,'.geojson'))
  
}

for(i in c(2010:2017)){
  
  assign(paste0('geojson_race_',i), get(paste0('geo_',i, '_race_stats')) %>%
           st_transform(crs = "+proj=longlat +datum=WGS84"))
  
  geojson_write(get(paste0('geojson_race_',i)), file = paste0('geo_race_',i,'.geojson'))
  
}
