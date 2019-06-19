/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tr, Td, unsafe } from 'reactable-arc';
import { SupersetClient } from '@superset-ui/connection';
import { t } from '@superset-ui/translation';

import withToasts from '../messageToasts/enhancers/withToasts';
import Loading from '../components/Loading';
import '../../stylesheets/reactable-pagination.css';
import GridList, {pickColorClass, getImage } from '../components/GridList';
import { Card, Image, Icon } from 'semantic-ui-react';

const propTypes = {
  search: PropTypes.string,
  addDangerToast: PropTypes.func.isRequired,
};

class DashboardTable extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dashboards: [],
      lastSearch: null
    };
  }

  refresh(){
    var url = '/dashboardasync/api/read?' +
              '_oc_DashboardModelViewAsync=changed_on' +
              '&_od_DashboardModelViewAsync=desc';
    if(this.props.search){
      url+= '&_flt_0_dashboard_title=' + this.props.search;
    }else{
      // Top X
      url += '&_psize_DashboardModelViewAsync=5';
    }
    SupersetClient.get({
      endpoint: url,
    })
      .then(({ json }) => {
         this.setState({ dashboards: json.result });
      })
      .catch(() => {
        this.props.addDangerToast(t('An error occurred while fethching Dashboards'));
      });
  }

  componentDidMount() {
    this.refresh();
  }

  componentDidUpdate() {
    var lastSearch = this.state.lastSearch;
    this.state.lastSearch = this.props.search;
    if(this.props.search != lastSearch){
      this.refresh();
    }
  }

  dashboardMeta(o){
    o.user = o.changed_by_name|| "";
    o.chageddate = o.changed_on.split("T")[0];
    return t('By: {{user}} \nModified: {{chageddate}}')
            .replace(/(\{\{([^\}]+)\}\})/mg, (m, m1, m2) => o[m2]);
  }

  extra(o){
    var entries = [(
      <span key={o.changed_on}><Icon name='calendar'/>
      {o.changed_on.split("T")[0]}</span>
    )]
    
    return (<Card.Content extra>{entries}</Card.Content>);
  }

  asFavourites(results){
    return [{image:'https://www.shareicon.net/download/2015/09/26/107800_star.svg',
            header:t('Favourites'),
            meta:t('Last viewed dashboard'),
            description:t('Use seach field to find more dashboards'),
            className:pickColorClass(0),
          }].concat(results)
  } 

  asResults(results){
    return [{image:'https://cdn1.iconfinder.com/data/icons/seo-part-1-1/128/Optimization-Seo-Search-Engine-Results-Graph-Monitor-512.png',
            header:t('Results'),
            meta:t('Dashboard found'),
            description:t('Refine search to find your dashboards'),
            className:pickColorClass(0),
          }].concat(results)
  } 

  recentDashboards(){
    var dashboardsCards = this.state.dashboards.map((o, i) => ({
      "card": (<Card
                href={o.url}
                key={i+1}
                className={pickColorClass(i+1)}
              >
              <Image src={getImage(o.b64thumbnail)} wrapped ui={false} />
              <span key="a" className="gradient"/>
              <Card.Content>
                <Card.Header>{o.dashboard_title}</Card.Header>
                <Card.Meta>
                  <span className='date'>{o.changed_on.split("T")[0]}</span>
                </Card.Meta>
                <Card.Description>
                  {o.description}
                </Card.Description>
              </Card.Content>
              {this.extra(o)}
            </Card>)
    }));
    if(this.props.search){
      return this.asResults(dashboardsCards);
    }
    return this.asFavourites(dashboardsCards);
  }

  grid(){
    return (<GridList
      collection={this.recentDashboards()}
    />);
  }

  table(){
    return (
      <Table
        className="table"
        sortable={['dashboard', 'creator', 'modified']}
        filterBy={this.props.search}
        filterable={['dashboard', 'creator']}
        itemsPerPage={50}
        hideFilterInput
        columns={[
          { key: 'dashboard', label: 'Dashboard' },
          { key: 'creator', label: 'Creator' },
          { key: 'modified', label: 'Modified' },
        ]}
        defaultSort={{ column: 'modified', direction: 'desc' }}
      >
        {this.state.dashboards.map(o => (
          <Tr key={o.id}>
            <Td column="dashboard" value={o.dashboard_title}>
              <a href={o.url}>{o.dashboard_title}</a>
            </Td>
            <Td column="creator" value={o.changed_by_name}>
              {unsafe(o.creator)}
            </Td>
            <Td column="modified" value={o.changed_on} className="text-muted">
              {unsafe(o.modified)}
            </Td>
          </Tr>))}
      </Table>
    );
  }
  render() {
    console.log("Table refresh... search " + this.props.search)
    if(this.props.grid){
      return this.grid()
    }else if (this.state.dashboards.length > 0) {
      return this.table();
    }
    return <Loading />;
  }
}

DashboardTable.propTypes = propTypes;

export default withToasts(DashboardTable);
