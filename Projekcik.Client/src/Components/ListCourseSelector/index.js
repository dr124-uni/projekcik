import React, { Component } from 'react';
import {
  ListGroup,
  ListGroupItem,
  Nav,
  NavItem,
  NavLink,
  TabPane,
  TabContent
} from 'reactstrap';
import UniService from '../../Services/UniService';
import classnames from 'classnames';
import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  CircularProgress
} from '@material-ui/core';

export default class ListCourseSelector extends Component {
  state = {
    voivodeships: [],
    universities: [],
    courses: [],

    voivodeship: '',
    university: '',
    course: '',
    courseId: null,

    open: false,
    loading: false,
    activeTab: 1,
    disabledTabs: 2,
    filterText: ''
  };

  handleChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  };

  handleDialogOpen = () => {
    this.setState(
      {
        open: true,
        loading: true,
        voivodeship: '',
        university: '',
        course: ''
      },
      () =>
        UniService.getVoivodeships()
          .then(data => this.setState({ voivodeships: data, loading: false }))
          .then(() => this.notifyParent())
    );
  };

  handleDialogClose = arg => {
    let stateUpdate = {
      open: false,
      loading: false,
      disabledTabs: 2,
      activeTab: 1
    };
    if (arg !== 'send') {
      stateUpdate = {
        ...stateUpdate,
        voivodeship: '',
        university: '',
        course: ''
      };
    }
    this.setState(stateUpdate, () => this.notifyParent());
  };

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  handleTabChange(currentTab, itemId, itemName) {
    if (currentTab === 1) {
      this.setState(
        {
          disabledTabs: 1,
          voivodeship: itemName
        },
        () => {
          UniService.getUniversities(itemId).then(data =>
            this.setState({ universities: data }, () => this.notifyParent())
          );
        }
      );
    } else if (currentTab === 2) {
      this.setState(
        {
          disabledTabs: 0,
          university: itemName
        },
        () => {
          UniService.getCourses(itemId).then(data =>
            this.setState({ courses: data }, () => this.notifyParent())
          );
        }
      );
    } else if (currentTab === 3) {
      this.setState({ courseId: itemId, course: itemName }, () =>
        this.notifyParent()
      );
    }
  }

  filterList = list => {
    return (list = list.filter(
      item =>
        item.name.toLowerCase().indexOf(this.state.filterText.toLowerCase()) >=
        0
    )).map(item => {
      return (
        <ListGroupItem
          className="mb-1 md text-center"
          key={item.id}
          tag="button"
          action
          onClick={() =>
            this.handleTabChange(this.state.activeTab, item.id, item.name)
          }>
          {item.name}
        </ListGroupItem>
      );
    });
  };

  notifyParent() {
    this.props.searchData({
      voivodeship: this.state.voivodeship ? this.state.voivodeship : '',
      university: this.state.university ? this.state.university : '',
      course: this.state.course ? this.state.course : '',
      courseId: this.state.course ? this.state.courseId : null
    });
  }

  render() {
    const { voivodeships, universities, courses, disabledTabs } = this.state;
    const voiData = this.filterList(voivodeships);
    const uniData = this.filterList(universities);
    const courseData = this.filterList(courses);

    return (
      <div>
        <Button
          className="button"
          variant="outlined"
          color="primary"
          onClick={this.handleDialogOpen}>
          Wybierz uczelnię i kierunek
        </Button>

        {/* ////////////BEGIN DIALOG/////////////////////////////////// */}

        <Dialog
          open={this.state.open}
          onClose={this.handleDialogClose}
          aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">
            Wybór uczelni i kierunku
          </DialogTitle>
          <DialogContent>
            <DialogContentText className="mb-2">
              Wybierz województwo, wyszukaj swoją uczelnię, a następnie wybierz
              kierunek odpowiadający Twojej notatce...
            </DialogContentText>

            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === 1
                  })}
                  onClick={() => {
                    this.toggle(1);
                  }}>
                  Województwo
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === 2
                  })}
                  disabled={disabledTabs > 1}
                  onClick={() => {
                    this.toggle(2);
                  }}>
                  Uczelnia
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: this.state.activeTab === 3
                  })}
                  disabled={disabledTabs > 0}
                  onClick={() => {
                    this.toggle(3);
                  }}>
                  Kierunek
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={this.state.activeTab}>
              <TextField
                id="filterText"
                className="field mb-3 mt-3"
                label="Wyszukaj..."
                fullWidth
                value={this.state.filterText}
                onChange={this.handleChange}
              />
              <TabPane tabId={1} className="mb-2">
                {this.state.loading && (
                  <div className="text-center mb-3">
                    <CircularProgress />
                  </div>
                )}

                <ListGroup>{voiData}</ListGroup>
              </TabPane>

              <TabPane tabId={2}>
                {this.state.loading && (
                  <div className="text-center mb-3">
                    <CircularProgress />
                  </div>
                )}
                <ListGroup>{uniData}</ListGroup>
              </TabPane>

              <TabPane tabId={3}>
                {this.state.loading && (
                  <div className="text-center mb-3">
                    <CircularProgress />
                  </div>
                )}
                <ListGroup>{courseData}</ListGroup>
              </TabPane>
            </TabContent>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleDialogClose} color="primary">
              Powrót
            </Button>
            <Button
              onClick={() => this.handleDialogClose('send')}
              disabled={this.state.course === ''}
              color="primary">
              Wyślij
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}