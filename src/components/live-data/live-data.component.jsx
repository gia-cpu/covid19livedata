import React from 'react';

// Tools.
import { Grid, _ as __ } from "gridjs-react";
import _ from 'lodash';
import numeral from 'numeral';

// Components.
import SearchFront  from '../search-front/search-front.component';
import DataSwitch  from '../data-switch/data-switch.component';


class Stats extends React.Component {

  constructor(props) {
    super(props);

    /* Declare data arrays. */
    this.todayData = [];
    this.yesterdayData = [];

    /* Declares state. */
    this.state = {
      searchTerm: '',
      covidData: [],
      when: 'now'
    }
    
  }


  /**
   * Toggles between today and 
   * yesterday's data.
   * 
   * @param {String} when Either now
   * or yesterday, to select which
   * data will be applied to the table.
   */
  toggleData = () => {
    if (this.state.when === 'now'){
      this.setState({
        when: 'yesterday',
        covidData: this.yesterdayData
      });
    } else {
      this.setState({ 
        when: 'now',
        covidData: this.todayData 
      });
    }
  }


  /**
   * Updates the search term.
   * 
   * This is passed down to the 
   * SearchFront component.
   */ 
  updateSearchTerm = (e) => {

    e.persist();
    if (!this.debouncedFn) {
      this.debouncedFn =  _.debounce(() => {
        this.setState({ searchTerm: e.target.value })
      }, 300);
    }
    this.debouncedFn();

  }

  
  componentDidMount() {

    /* Fetches data from today. */
    fetch('https://corona.lmao.ninja/v2/countries?&sort=todayDeaths', {
      method: 'GET'
    })
      .then( res => res.json() )
      .then( json => {
        this.todayData = json
        // Stores as initial data.
        this.setState({ 
          covidData: json 
        });
      })

    /* Fetches data from yesterday. */
    fetch('https://corona.lmao.ninja/v2/countries?yesterday=true&sort=todayDeaths', {
      method: 'GET'
    })
      .then( res => res.json() )
      .then( json => {
        this.yesterdayData = json
      })

  }

  render() {
    return (

      <React.Fragment>
        
        <DataSwitch when={this.state.when} toggleData={this.toggleData} />
        <SearchFront updateSearchTerm={this.updateSearchTerm} />

        <Grid
          data={
            this.state.covidData.map((country, key) => {
              return ([
                __(<React.Fragment><img className="flag" src={country.countryInfo.flag} /><br/>{country.countryInfo.iso2}</React.Fragment>),
                country.country,
                country.todayDeaths,
                country.deaths,
                country.todayCases,
                country.cases,
                country.deathsPerOneMillion,
              ]);
            }) 
          }
          columns={[
            { name: '-' },
            { name: '-', hidden: true }, 
            { name: 'New deaths', formatter: (cell) => `${numeral(cell).format('+0,0')}` },
            { name: 'All deaths', formatter: (cell) => __(<span className="light">{numeral(cell).format('0.0a')}</span>) },
            { name: 'New cases', formatter: (cell) => `${numeral(cell).format('+0,0')}` },
            { name: 'All cases', formatter: (cell) => __(<span className="light">{numeral(cell).format('0.0a')}</span>) },
            { name: 'Deaths/M', formatter: (cell) => `${numeral(cell).format('0,0')}` }
          ]}
          sort={{ enabled: true }}
          search={{ enabled: true, keyword: this.state.searchTerm }}
          pagination={{ enabled: true, limit: 40 }}
          language={{ 
            search: { placeholder: 'Search a country...' },
            pagination: { previous: '←', next: '→' }
          }}
        />
      </React.Fragment>

    )
  }

}

export default Stats;

