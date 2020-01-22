# install required packages -----------------------------------------------


##install required packages auto-detect/install required packages

list.of.packages <- c('tidyverse','magrittr','tidycensus','reshape2','tigris','readxl','hablar','sf','geojsonio', 'spdep', 'jsonlite')


new.packages <- list.of.packages[!(list.of.packages %in% installed.packages()[,"Package"])]
if(length(new.packages)) install.packages(new.packages)

rm(list.of.packages, new.packages)

# collect data ------------------------------------------------------------

library(tidyverse)
library(magrittr)
library(tidycensus)
library(reshape2)
library(tigris)
library(readxl)
library(hablar)
library(sf)
library(geojsonio)
library(spdep)
library(jsonlite)

# insert your census api key below -- Get one at:
# http://api.census.gov/data/key_signup.html

census_api_key(key = '*', install = TRUE, overwrite = TRUE)
readRenviron("~/.Renviron")

# https://www.dshs.texas.gov/chs/popdat/downloads.shtm


# lists of variables  -----------------------------------------------------------

### lists of yr 2000 variables 
library(totalcensus)

sf1_2000_variables <- load_variables(2000, 'sf1', cache = TRUE)
sf3_2000_variables <- load_variables(2000, 'sf3', cache = TRUE)
sf1_2010_variables <- load_variables(2010, 'sf1', cache = TRUE)

### download specific variables

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
                                        'RACE:Total 2+ races',
                                        'RACE:Total 2 races',
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

acs5_variables <- data.frame(name = c('Estimate!!EDUCATIONAL ATTAINMENT!!Population 25 years and over',
                                         'Estimate!!EDUCATIONAL ATTAINMENT!!Less than 9th grade',
                                         'Estimate!!EDUCATIONAL ATTAINMENT!!High school graduate (includes equivalency)',
                                         'Estimate!!EDUCATIONAL ATTAINMENT!!Some college, no degree	',
                                         "Estimate!!EDUCATIONAL ATTAINMENT!!Associate's degree",
                                         "Estimate!!EDUCATIONAL ATTAINMENT!!Bachelor's degree",
                                         'Estimate!!EDUCATIONAL ATTAINMENT!!Graduate or professional degree',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!Population 5 years and over',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!English only',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!Language other than English',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!Language other than English!!Speak English less than "very well"',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!Language other than English!!Spanish',
                                         'Estimate!!LANGUAGE SPOKEN AT HOME!!Language other than English!!Spanish!!Speak English less than "very well"',
                                         'Estimate!!INCOME!!Less than $10,000',
                                         'Estimate!!INCOME!!$10,000 to $14,999',
                                         'Estimate!!INCOME!!$15,000 to $24,999',
                                         'Estimate!!INCOME!!$25,000 to $34,999',
                                         'Estimate!!INCOME!!$35,000 to $49,999',
                                         'Estimate!!INCOME!!$50,000 to $74,999',
                                         'Estimate!!INCOME!!$75,000 to $99,999',
                                         'Estimate!!INCOME!!$100,000 to $149,999',
                                         'Estimate!!INCOME!!$150,000 to $199,999',
                                         'Estimate!!INCOME!!$200,000 or more',
                                         'Estimate!!INCOME!!With Supplemental Security Income',
                                         'Estimate!!INCOME!!With cash public assistance income',
                                         'Estimate!!INCOME!!With Food Stamp/SNAP benefits in the past 12 months',
                                         'Estimate!!RACE!!Total population',
                                         'Estimate!!RACE!!One race',
                                         'Estimate!!RACE!!Two or more races',
                                         'Estimate!!RACE!!One race!!White',
                                         'Estimate!!RACE!!One race!!Black or African American',
                                         'Estimate!!RACE!!One race!!American Indian and Alaska Native',
                                         'Estimate!!RACE!!One race!!Asian',
                                         'Estimate!!RACE!!One race!!Asian!!Asian Indian',
                                         'Estimate!!RACE!!One race!!Native Hawaiian and Other Pacific Islander',
                                         'Estimate!!RACE!!One race!!Some other race',
                                         'Estimate!!RACE!!One race!!Hispanic or Latino'), 
variable = c('DP02_0058E',
                             'DP02_0059E',
                             'DP02_0061E',
                             'DP02_0062E',
                             'DP02_0063E',
                             'DP02_0064E',
                             'DP02_0065E',
                             'DP02_0110E',
                             'DP02_0111E',
                             'DP02_0112E',
                             'DP02_0113E',
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
                             'DP03_0070E',
                             'DP03_0072PE',
                             'DP03_0074PE',
                             'DP03_0073PE',
                             'DP05_0028E',
                             'DP05_0029E',
                             'DP05_0030E',
                             'DP05_0032E',
                             'DP05_0033E',
                             'DP05_0034E',
                             'DP05_0039E',
                             'DP05_0040E',
                             'DP05_0047E',
                             'DP05_0052E',
                             'DP05_0065E'))


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

# write csv's -------------------------------------------------------------

library(jsonlite)

acs5_variables <- 
  cbind(acs5_variables %>% select(variable),
         acs5_variables %>%
           select(name, variable) %>%
           do(colsplit(string = .$name, pattern = '!!', names = c('type', 'group', 'name'))))

acs5_variables %<>%
  mutate(name = str_remove(name, 'One race!!'),
         name = str_remove(name, 'Language other than English!!'))

write_json(acs5_variables %>%
             select(name, variable), 'acs5_variables.json')

write_json(sf1_variables %>%
             select(name, variable), 'sf1_variables.json')

write_json(sf3_variables %>%
             select(name, variable), 'sf3_variables.json')

write.csv(sf1_variables %>%
select(name, variable), 'sf1_variables.csv', row.names = FALSE)
write.csv(sf3_variables %>%
select(name, variable), 'sf3_variables.csv', row.names = FALSE)
write.csv(acs5_variables %>%
select(name, variable), 'acs5_variables.csv', row.names = FALSE)


# correllate spaces for moran's I -----------------------------------------
### calculate centroids of census tracts

library(spdep)
library(jsonlite)

for(i in c(2000:2017)){

assign(paste0('weight_matrix_', i), poly2nb(get(paste0('geo_',i,'_stats'))))

assign(paste0('weight_matrix_', i), nb2mat(get(paste0('weight_matrix_', i)), style="B",zero.policy=T))

weight_matrix_totals <- reshape2::melt(weight_matrix_2000) %>% filter(value > 0)

weight_matrix_totals %<>%
  select(-value) %>%
  group_by(Var1) %>%
  nest(.)

which(weight_matrix_totals$data[[1]] %in% weight_matrix_totals$data[[3]])

}

# create index of census tracts

for(i in c(2000:2017)){

assign(paste0('tract_indeces_', i), as.data.frame.vector(unique(get(paste0('geo_',i,'_stats')) %$% TRACT), nm = paste(deparse(substitute(TRACT)))))

assign(paste0('tract_indeces_', i), get(paste0('tract_indeces_', i)) %>%
         mutate(index = row_number(TRACT)))

assign(paste0('geo_',i,'_stats'), merge(get(paste0('geo_',i,'_stats')), get(paste0('tract_indeces_', i)), by = c('TRACT')))

assign(paste0('geojson_',i), get(paste0('geo_',i, '_stats')) %>%
         st_transform(crs = "+proj=longlat +datum=WGS84"))

geojson_write(get(paste0('geojson_',i)), file = paste0('geo_',i,'.geojson'))

write_json(get(paste0('weight_matrix_', i)), paste0('weight_matrix_', i,'.json'), rownames = TRUE, colnames = TRUE, dataframe = c('rows'))

}

# means/sdev for moran ----------------------------------------------------

morans_i_sd <- geo_2000_stats %>%
  as.data.frame(.) %>%
  select(TRACT, year, starts_with('DP'))

stats_dfs <- ls(pattern = 'geo_...._stats')

stats_dfs <- lapply(stats_dfs, get)

for(i in 2:length(stats_dfs)){
  morans_i_sd <-   bind_rows(morans_i_sd, stats_dfs[[i]] %>% 
                            select(TRACT, year, starts_with('DP')))
}

morans_i_sd <- as.data.frame(morans_i_sd)

morans_i_sd %<>%
  select(-geometry)

dp_variables <- dput(colnames(morans_i_sd %>% select(starts_with('DP'))))

morans_i_sd %<>% 
  group_by(year) %>%
  mutate_at(., c("DP02_0058", "DP02_0059", "DP02_0061", "DP02_0062", "DP02_0063", 
                 "DP02_0064", "DP02_0065", "DP02_0110", "DP02_0111", "DP02_0112", 
                 "DP02_0113", "DP02_0114", "DP02_0115", "DP03_0070", "DP03_0072P", 
                 "DP03_0073P", "DP03_0074P", "DP03_0076", "DP03_0077", "DP03_0078", 
                 "DP03_0080", "DP03_0081", "DP03_0082", "DP03_0083", "DP03_0084", 
                 "DP03_0085", "DP05_0028", "DP05_0029", "DP05_0030", "DP05_0032", 
                 "DP05_0033", "DP05_0034", "DP05_0039", "DP05_0040", "DP05_0047", 
                 "DP05_0052", "DP05_0065"), .funs = function(x){x - mean(x, na.rm = TRUE)})

morans_i_sd %<>% 
  group_by(year) %<>%
  mutate_at(., c("DP02_0058", "DP02_0059", "DP02_0061", "DP02_0062", "DP02_0063", 
                 "DP02_0064", "DP02_0065", "DP02_0110", "DP02_0111", "DP02_0112", 
                 "DP02_0113", "DP02_0114", "DP02_0115", "DP03_0070", "DP03_0072P", 
                 "DP03_0073P", "DP03_0074P", "DP03_0076", "DP03_0077", "DP03_0078", 
                 "DP03_0080", "DP03_0081", "DP03_0082", "DP03_0083", "DP03_0084", 
                 "DP03_0085", "DP05_0028", "DP05_0029", "DP05_0030", "DP05_0032", 
                 "DP05_0033", "DP05_0034", "DP05_0039", "DP05_0040", "DP05_0047", 
                 "DP05_0052", "DP05_0065"), .funs = function(x){x / sd(x, na.rm = TRUE)})

write_json(morans_i_sd, 'morans_i_sd.json')


 # weight matrix -----------------------------------------------------------

library(reshape2)
library(magrittr)

weight_matrix_2000_df <- as.data.frame(weight_matrix_2000)
weight_matrix_2000_melt <- melt(weight_matrix_2000)

weight_matrix_sums <- as.data.frame.vector(list(which(weight_matrix_2000_df$V1 == 1)), nm = paste(deparse(substitute(shared_neighbors))))

for(i in 2:length(weight_matrix_2000_df)){
  weight_matrix_sums$shared_neighbors <- append(weight_matrix_sums$shared_neighbors, list(as.vector(which(get(weight_matrix_2000_df) %$% paste0('V', i))) == 1))
}


# import school addresses -------------------------------------------------

google_1 <- google_1[-c(1:24),]

colnames(google_1) <- c('school_1', 'school_2', 'school_3', 'school_4', 'school_5')

google_1 %<>%
  mutate(school_2 = case_when(school_1 == 'San Antonio' ~ paste0(school_1,", " , school_2)))

google_1 %<>%
  mutate(school_2 = lead(school_2, 1))

google_1 %<>%
  mutate(school_2 = paste0(str_extract(school_1, '[[0-9]]+.*'), ', ', school_2))

google_1 %<>%
  mutate(school_3 = case_when(str_detect(school_2, 'San Antonio') ~ school_2))

google_1 %<>%
mutate(school_3 = zoo::na.locf(school_3, fromLast = TRUE, na.rm = FALSE))

google_1<- google_1[,-c(2)]

google_1 %<>%
  mutate(school_1 = str_remove(school_1, '.[[0-9]]+.*'),
         school_1 = str_remove(school_1, 'Add to Compare'),
         school_1 = str_remove(school_1, 'Alternative School'),
         school_1 = str_remove(school_1, 'Charter School'),
         school_1 = str_remove(school_1, '[[0-9]]+.*'))

dataset %<>%
  filter(str_detect(countyname_g9, 'BEXAR'))

library(fuzzyjoin)

fuzzy <- stringdist_left_join(dataset[,c(3)], google_1[,c(1)], by = c(campname_g9 = 'school_1'), ignore_case = T, method = "jw", distance_col = 'dist')

fuzzy %<>% 
filter(dist < .18) %>%
  distinct()

library(googleway)

schools <- unique(dataset$campname_g9)

set_key(c(*))

testo <- list(google_places(search_string = schools, location = c(29.424349, -98.491142)))

for(i in 1:length(schools)){
temp <- list(google_places(search_string = schools[i], location = c(29.424349, -98.491142)))

testo <- rbind(testo, temp)
}

testo[[2]]

schools <- as.data.frame.vector(schools, nm = paste(deparse(substitute(name))))


names <- testo[[2]]$results$name
addresses <- testo[[2]]$results$formatted_address

geometry <- testo[[2]]$results$geometry

length(testo)


for(i in 3:length(testo)){
  names <- append(names, testo[[i]]$results$)
}

for(i in 3:length(testo)){
  geometry <- append(geometry, testo[[i]]$results$geometry)
}

for(i in 3:length(testo)){
  addresses <- append(addresses, testo[[i]]$results$formatted_address)
}

schools_df <- data.frame(names, addresses)

fuzzy <- stringdist_left_join(dataset[,c(3)], schools_df, by = c(campname_g9 = 'names'), ignore_case = T, method = "jw", distance_col = 'dist')
fuzzo <- stringdist_left_join(dataset[,c(3)], schools_df, by = c(campname_g9 = 'names'), ignore_case = T, method = "cosine", distance_col = 'dist')
fuzzi <- stringdist_left_join(dataset[,c(3)], schools_df, by = c(campname_g9 = 'names'), ignore_case = T, method = "lv", distance_col = 'dist')
fuzzio <- stringdist_left_join(dataset[,c(3)], schools_df, by = c(campname_g9 = 'names'), ignore_case = T, method = "lcs", distance_col = 'dist')

fuzzy <- rbind(fuzzy, fuzzo)
fuzzy <- rbind(fuzzy, fuzzi)
fuzzy <- rbind(fuzzy, fuzzio)


fuzzy <- distinct(fuzzy)
fuzzy_1 <- distinct(fuzzy_1)

library(magrittr)
fuzzy %<>%
  arrange(dist)

fuzzy_1 <- fuzzy[c(1:11),]
fuzzy <- fuzzy[-c(1:11),]

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,18,19,21,23,24,25,26,27,28,29,30,31,34,36,45,51,64),])

fuzzy %<>%
  filter(!names %in% fuzzy_1$names)

fuzzy %<>%
  filter(!campname_g9 %in% fuzzy_1$campname_g9)

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(8,17,19,44,59,184),])

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(1,2,3,4,7,12,31),])

fuzzy_1 <- fuzzy_1[-c(56,53,51,49),]
fuzzy_1 <- fuzzy_1[-c(48,46,47,45,44),]

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(1),])
fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(3,7, 11, 13, 82),])

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(49,50,52,53, 63,69, 71, 85),])

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(27, 29, 38, 41, 52,54,112,116,138),])

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(143),])

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(88),])

fuzzy_1 <- fuzzy_1[-c(73),]

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(651),])

fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(1,29),])
fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(1,34),])
fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(157),])
fuzzy_1 <- rbind(fuzzy_1, fuzzy[c(131),])

testo <- merge(dataset[,c(3)], fuzzy_1, by = c('campname_g9'), all.x = TRUE)
testo %<>%
  distinct()

fuzzy_1 %<>%
  filter(campname_g9 != 'HARLANDALE ISD STEM ECHS-ALAMO COL')
fuzzy_1 %<>%
  filter(names != "Young Women's Leadership Academy Foundation")
fuzzy_1 %<>%
  filter(names != "School of Excellence In Education - Walker Elementary")
fuzzy_1 %<>%
  filter(names != "School of Science and Technology-Alamo")
fuzzy_1 %<>%
  filter(names != "School of Science and Technology - Discovery")
fuzzy_1 %<>%
  filter(!(campname_g9 == "SCHOOL OF SCIENCE AND TECHNOLOGY	" & names == "School of Science and Technology - Discovery"))

testo %<>%
  select(campname_g9, names, addresses) %>%
  distinct()

testo <- testo[-c(58),]

testo[c(1),] <- c('ABOVE & BEYOND HIGH SCHOOL', 'Above & Beyond High School', 'Could Not Find')
testo[c(30),] <- c('JUDSON SENIOR H S','Judson High School','9142 FM78, Converse, TX 78109, United States')
testo[c(36),] <- c('LIVING WAY LEADERSHIP ACADEMY','Living Way Leadership Academy','4434 Roland Road, San Antonio, TX 78222')
testo[c(15),] <- c('HARLANDALE ISD STEM ECHS-ALAMO COL','Harlandale ISD Stem Echs-Alamo Colleges at PAC','4040 Apollo Street, San Antonio, TX 78214')
testo[c(48),] <- c('NORTHSIDE ALTER SCH','Northside Alternative School','144 Hunt Ln')
testo[c(52),] <- c('RICK HAWKINS H S','Rick Hawkins High School (closed)','1826 Basse Rd, San Antonio, Texas 78213')
testo[c(58),] <- c('SO SAN ANTONIO H S WEST','West Campus High School','5622 Ray Ellison Blvd, San Antonio, TX 78242')
testo[c(67),] <- c('VIRGINIA ALLRED STACEY JR/SR H S','Stacey Jr-Sr High School','2469 Kenly Avenue, San Antonio, TX 78236')
testo[c(43),] <- c('NAVARRO ACHIEVEMENT CTR','Navarro Achievement Center','623 S Pecos La Trinidad, San Antonio, TX 78207')

testo <- hablar::retype(testo)


# geochode ----------------------------------------------------------------

library(ggmap)

register_google(*)
schools_geocode <- geocode(location = as.character(testo$addresses), output = c("latlona"), source = c("google"))

testo$addresses <- tolower(testo$addresses)
testo <- cbind(testo, schools_geocode)

extras <- testo[is.na(testo$lon),]

extra_extras<- geocode(location = extras$addresses, output = c("latlona"), source = c("google"))

testo[c(49),] <- c("POSITIVE SOLUTIONS CHARTER SCHOOL", "San Antonio Positive Solutions Charter School", 
  "1325 n flores st #100, san antonio, tx 78212, united states", 
  "-98.5029029", "29.4381693", NA)


schools_big_df <- merge(dataset, testo, by = c('campname_g9'), aall.x = TRUE)


# break schools_big_df into years --------------------------------------------------------

schools_2000 <- schools_big_df %>% filter(year_g9 == 2000) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2001 <- schools_big_df %>% filter(year_g9 == 2001) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2002 <- schools_big_df %>% filter(year_g9 == 2002) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2003 <- schools_big_df %>% filter(year_g9 == 2003) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2004 <- schools_big_df %>% filter(year_g9 == 2004) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2005 <- schools_big_df %>% filter(year_g9 == 2005) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2006 <- schools_big_df %>% filter(year_g9 == 2006) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2007 <- schools_big_df %>% filter(year_g9 == 2007) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2008 <- schools_big_df %>% filter(year_g9 == 2008) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2009 <- schools_big_df %>% filter(year_g9 == 2009) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2010 <- schools_big_df %>% filter(year_g9 == 2010) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2011 <- schools_big_df %>% filter(year_g9 == 2011) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2012 <- schools_big_df %>% filter(year_g9 == 2012) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2013 <- schools_big_df %>% filter(year_g9 == 2013) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2014 <- schools_big_df %>% filter(year_g9 == 2014) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)
schools_2015 <- schools_big_df %>% filter(year_g9 == 2015) %>% select(year_g9, names, lat, lon, district_g9, size, hsgrad_4, ps_enroll_t5, grad12_ba)

write_json(schools_2000, 'schools_2000.json')
write_json(schools_2001, 'schools_2001.json')
write_json(schools_2002, 'schools_2002.json')
write_json(schools_2003, 'schools_2003.json')
write_json(schools_2004, 'schools_2004.json')
write_json(schools_2005, 'schools_2005.json')
write_json(schools_2006, 'schools_2006.json')
write_json(schools_2007, 'schools_2007.json')
write_json(schools_2008, 'schools_2008.json')
write_json(schools_2009, 'schools_2009.json')
write_json(schools_2010, 'schools_2010.json')
write_json(schools_2011, 'schools_2011.json')
write_json(schools_2012, 'schools_2012.json')
write_json(schools_2013, 'schools_2013.json')
write_json(schools_2014, 'schools_2014.json')
write_json(schools_2015, 'schools_2015.json')
