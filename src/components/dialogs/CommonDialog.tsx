import React from 'react';

import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import { ICommonDialogProps } from '../../types/dialogs';

class CommonDialog<P extends ICommonDialogProps = ICommonDialogProps, S = never> extends React.PureComponent<P, S> {

  // could be overloaded by subclasses
  public getContent(): React.ReactNode { return null; }
  public firstButtonClick() {}
  public secondButtonClick() {}
  public thirdButtonClick() {}

  public render(): React.ReactNode {
    return (
      <Dialog open={this.props.open} keepMounted={true}>
        <DialogTitle>{this.props.title}</DialogTitle>
        <DialogContent>
          {this.props.content ?? this.getContent()}
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={this.props.firstButtonOnClick ?? this.firstButtonClick}>
            {this.props.firstButton}
          </Button>
          {this.props.secondButton !== undefined ? (
            <Button color="primary" onClick={this.props.secondButtonOnClick ?? this.secondButtonClick}>
              {this.props.secondButton}
            </Button>
          ) : null}
          {this.props.thirdButton !== undefined ? (
            <Button color="primary" onClick={this.props.thirdButtonOnClick ?? this.thirdButtonClick}>
              {this.props.thirdButton}
            </Button>
          ) : null}
        </DialogActions>
      </Dialog>
    );
  }
}

export default CommonDialog;
