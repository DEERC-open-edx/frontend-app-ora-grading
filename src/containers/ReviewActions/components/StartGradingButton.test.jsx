import React from 'react';
import { shallow } from 'enzyme';

import { selectors, thunkActions } from 'data/redux';
import { RequestKeys } from 'data/constants/requests';
import { gradingStatuses as statuses } from 'data/services/lms/constants';

import {
  StartGradingButton,
  mapStateToProps,
  mapDispatchToProps,
} from './StartGradingButton';

jest.mock('data/redux', () => ({
  selectors: {
    grading: {
      selected: {
        gradeStatus: (state) => ({ gradeStatus: state }),
        gradingStatus: (state) => ({ gradingStatus: state }),
      },
    },
    requests: { isPending: (...args) => ({ isPending: args }) },
  },
  thunkActions: {
    grading: {
      startGrading: jest.fn(),
      stopGrading: jest.fn(),
    },
  },
}));
jest.mock('./OverrideGradeConfirmModal', () => 'OverrideGradeConfirmModal');
jest.mock('./StopGradingConfirmModal', () => 'StopGradingConfirmModal');

let el;

describe('StartGradingButton component', () => {
  describe('component', () => {
    const props = {
      gradeIsPending: false,
      lockIsPending: false,
    };
    beforeEach(() => {
      props.startGrading = jest.fn().mockName('this.props.startGrading');
      props.stopGrading = jest.fn().mockName('this.props.stopGrading');
    });
    describe('snapshotes', () => {
      const mockedEl = (gradingStatus, gradeStatus) => {
        const renderedEl = shallow(
          <StartGradingButton
            {...props}
            gradingStatus={gradingStatus}
            gradeStatus={gradeStatus || gradingStatus}
          />,
        );
        const mockMethod = (methodName) => {
          renderedEl.instance()[methodName] = jest.fn().mockName(`this.${methodName}`);
        };
        mockMethod('handleClick');
        mockMethod('hideConfirmOverrideGrade');
        mockMethod('confirmOverrideGrade');
        mockMethod('hideConfirmStopGrading');
        mockMethod('confirmStopGrading');
        return renderedEl;
      };
      test('snapshot: locked (null)', () => {
        el = mockedEl(statuses.locked);
        expect(el.instance().render()).toMatchSnapshot();
        expect(el.isEmptyRender()).toEqual(true);
      });
      test('snapshot: ungraded (startGrading callback)', () => {
        expect(mockedEl(statuses.ungraded).instance().render()).toMatchSnapshot();
      });
      test('snapshot: grade pending (disabled)', () => {
        el = mockedEl(statuses.ungraded);
        el.setProps({ gradeIsPending: true });
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('snapshot: lock pending (disabled)', () => {
        el = mockedEl(statuses.ungraded);
        el.setProps({ lockIsPending: true });
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('snapshot: graded, confirmOverride (startGrading callback)', () => {
        el = mockedEl(statuses.graded);
        el.setState({ showConfirmOverrideGrade: true });
        expect(el.instance().render()).toMatchSnapshot();
      });
      test('snapshot: inProgress, isOverride, confirmStop (stopGrading callback)', () => {
        el = mockedEl(statuses.inProgress, statuses.graded);
        el.setState({ showConfirmStopGrading: true });
        expect(el.instance().render()).toMatchSnapshot();
      });
    });
  });
  describe('mapStateToProps', () => {
    let mapped;
    const testState = { some: 'test-state' };
    beforeEach(() => {
      mapped = mapStateToProps(testState);
    });
    test('gradeIsPending loads from requests.gradeIsPending(submitGrade)', () => {
      expect(mapped.gradeIsPending).toEqual(
        selectors.requests.isPending(
          testState,
          { requestKey: RequestKeys.submitGrade },
        ),
      );
    });
    test('lockIsPending loads from requests.lockIsPending(setLock)', () => {
      expect(mapped.lockIsPending).toEqual(
        selectors.requests.isPending(
          testState,
          { requestKey: RequestKeys.setLock },
        ),
      );
    });
    test('gradeStatus loads from grading.selected.gradeStatus', () => {
      expect(mapped.gradeStatus).toEqual(selectors.grading.selected.gradeStatus(testState));
    });
    test('gradingStatus loads from grading.selected.gradingStatus', () => {
      expect(mapped.gradingStatus).toEqual(selectors.grading.selected.gradingStatus(testState));
    });
  });
  describe('mapDispatchToProps', () => {
    it('loads startGrading from thunkActions.grading.stargGrading', () => {
      expect(mapDispatchToProps.startGrading).toEqual(thunkActions.grading.startGrading);
    });
    it('loads stopGrading from thunkActions.grading.cancelGrading', () => {
      expect(mapDispatchToProps.stopGrading).toEqual(thunkActions.grading.cancelGrading);
    });
  });
});
