import React from 'react'
import { Card, Icon, Image } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const src = 'https://react.semantic-ui.com/images/wireframe/white-image.png'

const propTypes = {
  /*itemId: PropTypes.number.isRequired,
  fetchFaveStar: PropTypes.func,
  saveFaveStar: PropTypes.func,
  isStarred: PropTypes.bool.isRequired,*/
};

const palette = ['red', 'orange', 'yellow', 'olive', 'green', 'teal', 'blue', 'violet',
                    'purple', 'pink', 'brown', 'grey'];
const paletteLen = palette.length;

export default class GridList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    pickColor(ix){
        ix = ix >= paletteLen ? ix - (paletteLen * Math.floor(ix/paletteLen)) : ix;
        return palette[ix];
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
                    color={this.pickColor()} 
                />)
            )}
            </Card.Group>
        );
    }
}

GridList.propTypes = propTypes;

