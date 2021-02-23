import React from 'react';
import { Grid, _ } from "gridjs-react";
import numeral from 'numeral';
import './App.css';

class Stats extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      covidData: [],
      when: 'now'
    }
    const FETCH_URL = '';
  }

  toggleYesterday = (when) => {
    if (when === 'now'){
      this.setState({ when: 'yesterday' }, () => {this.fetchCountriesData()});
    } else {
      this.setState({ when: 'now' }, () => {this.fetchCountriesData()});
    }
  }

  fetchCountriesData() {
    console.log(this.state.when);
    if (this.state.when === 'now'){
      this.FETCH_URL = "https://corona.lmao.ninja/v2/countries?&sort=todayDeaths";
    } else {
      this.FETCH_URL = "https://corona.lmao.ninja/v2/countries?yesterday=true&sort=todayDeaths";
    }
    
    fetch(this.FETCH_URL, {
      method: 'GET',
      cache: "force-cache"
    })
      .then( res => res.json() )
      .then( json => { 
        this.setState({ 
          covidData: json 
        });
        console.log(json);
    });
  }

  
  componentDidMount() {
    this.fetchCountriesData();
  }

  render() {
    
    return (
      <React.Fragment>
        <div className="switch-data">
          You are viewing&nbsp;
          <button className="switch" onClick={() => { this.toggleYesterday(this.state.when) }}>
            { this.state.when === 'now' ? "today's" : "yesterday's" }
          </button>&nbsp;data.
        </div>
        <Grid
          data={      
            this.state.covidData.map((country, key) => {
              return ([
                _(<React.Fragment><img className="flag" src={country.countryInfo.flag} />{country.countryInfo.iso2}</React.Fragment>),
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
            {
              name: '-'
            },
            {
              name: '-',
              hidden: true
            }, 
            {
              name: 'New deaths',
              formatter: (cell) => `${numeral(cell).format('+0,0')}`
            },
            {
              name: 'All deaths',
              formatter: (cell) => _(<span className="light">{numeral(cell).format('0.0a')}</span>)
            },
            {
              name: 'New cases',
              formatter: (cell) => `${numeral(cell).format('+0,0')}`
            },
            {
              name: 'All cases',
              formatter: (cell) => _(<span className="light">{numeral(cell).format('0.0a')}</span>)
            },
            {
              name: 'Deaths/M',
              formatter: (cell) => `${numeral(cell).format('0,0')}`
            }
          ]}
          sort={
            {
              enabled: true,
            }
          }
          search={true}
          pagination={{
            enabled: true,
            limit: 50,
          }}
          language={{
            search: {
              placeholder: 'Search a country...',
              keyword: `${this.state.searchTerm}`
            },
            pagination: {
              previous: '←',
              next: '→',
            }
          }}
        />
        <div className="copyright">v4 - Giacomo M. - NovelCOVID API</div>
      </React.Fragment>
    )
  }

}

export default Stats;

