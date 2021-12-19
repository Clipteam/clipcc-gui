import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import LoadErrorModalComponent from '../components/load-error-modal/load-error-modal.jsx';

const LoadErrorModal = ({
    data,
    onRequestClose
}) => (
    <LoadErrorModalComponent
        onRequestClose={onRequestClose}
        data={data}
    />
);

LoadErrorModal.propTypes = {
    onRequestClose: PropTypes.func,
    data: PropTypes.shape({
        errorId: PropTypes.string,
        detail: PropTypes.string,
        missingExtensions: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.string,
            version: PropTypes.string
        }))
    })
};

const mapStateToProps = state => ({
    data: state.scratchGui.loadError
});

export default connect(
    mapStateToProps
)(LoadErrorModal);
