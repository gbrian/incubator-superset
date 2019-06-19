import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import '../../stylesheets/less/gridlist.less';

const src = 'https://react.semantic-ui.com/images/wireframe/white-image.png'

const propTypes = {
  /*itemId: PropTypes.number.isRequired,
  fetchFaveStar: PropTypes.func,
  saveFaveStar: PropTypes.func,
  isStarred: PropTypes.bool.isRequired,*/
};


const paletteLen = 5; // Same as .median-cut-X { ... } entries at gridlist.less

export default class GridList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    pickColorClass(ix){
        if(ix >= paletteLen){
            ix = ix - (paletteLen * Math.floor(ix/paletteLen));
        }
        return 'median-cut-' + ix;
    }
    getImage(e){
        return e.img || '/static/assets/images/noimage.png';
    }
    render() {
        return (
            <Card.Group itemsPerRow={4}>
             {this.props.collection.map((e, i) => 
                (<Card 
                    href={e.href}
                    header={e.header}
                    description={e.description}
                    image={this.getImage(e)}
                    key={i}
                    className={this.pickColorClass(i)}
                />)
            )}
            </Card.Group>
        );
    }
}

GridList.propTypes = propTypes;

