import React from 'react';
import { Grid, _ as __ } from "gridjs-react";
import _ from 'lodash';
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
    const todayData = [];
    const yesterdayData = [];
  }


  toggleYesterday = (when) => {
    if (when === 'now'){
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

  
  componentDidMount() {

    fetch('https://corona.lmao.ninja/v2/countries?&sort=todayDeaths', {
      method: 'GET'
    })
      .then( res => res.json() )
      .then( json => {
        this.todayData = json
        this.setState({ 
          covidData: json 
        });
      })

    fetch('https://corona.lmao.ninja/v2/countries?yesterday=true&sort=todayDeaths', {
      method: 'GET'
    })
      .then( res => res.json() )
      .then( json => {
        this.yesterdayData = json
      })

  }

  render() {

    const searchKeyword = this.state.searchTerm;
    
    return (
      <React.Fragment>
        <div className="switch-data">
          You are viewing&nbsp;
          <button className="switch" onClick={() => { this.toggleYesterday(this.state.when) }}>
            { this.state.when === 'now' ? "today's" : "yesterday's" }
          </button>&nbsp;data.
        </div>
        <div className="search-box">
          <input 
            type="search" 
            className="search-front"
            placeholder="Search a country..."
            onChange={(e) => {
              e.persist();
              if (!this.debouncedFn) {
                this.debouncedFn =  _.debounce(() => {
                  this.setState({ searchTerm: e.target.value })
                }, 300);
              }
              this.debouncedFn();
            }}
          />
        </div>
        <Grid
          data={
            this.state.covidData.map((country, key) => {
              return ([
                __(<React.Fragment><img className="flag" src={country.countryInfo.flag} />{country.countryInfo.iso2}</React.Fragment>),
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
              formatter: (cell) => __(<span className="light">{numeral(cell).format('0.0a')}</span>)
            },
            {
              name: 'New cases',
              formatter: (cell) => `${numeral(cell).format('+0,0')}`
            },
            {
              name: 'All cases',
              formatter: (cell) => __(<span className="light">{numeral(cell).format('0.0a')}</span>)
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
          search={{
            enabled: true,
            keyword: this.state.searchTerm
          }}
          pagination={{
            enabled: true,
            limit: 50,
          }}
          language={{
            search: {
              placeholder: 'Search a country...',
            },
            pagination: {
              previous: '←',
              next: '→',
            }
          }}
        />
        <div className="copyright">v4.0.1 - Giacomo M. - NovelCOVID API</div>
      </React.Fragment>
    )
  }

}

export default Stats;

