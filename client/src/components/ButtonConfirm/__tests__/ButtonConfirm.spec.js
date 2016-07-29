import expect, { createSpy, spyOn, isSpy } from 'expect';
import React from 'react';
import { shallow, mount, render } from 'enzyme';
import ButtonConfirm from '../ButtonConfirm';

describe('<ButtonConfirm />', () => {
  let wrapper;
  let onClickSpy;

  beforeEach(() => {
    onClickSpy = createSpy();
    wrapper = shallow(<ButtonConfirm value="test" onClick={onClickSpy} />);
  });

  it('should have value as text', () => {
    expect(wrapper.text()).toEqual('test');
  });

  describe('handling onClick', () => {
    beforeEach(() => {
      wrapper.simulate('click');
    });

    describe('clicking the button', () => {
      it('should not have called the spy', () => {
        expect(onClickSpy).toNotHaveBeenCalled();
      });

      it('should show confirmation message', () => {
        expect(wrapper.text()).toEqual('are you sure? yes / no');
      });
    });

    describe('confirming yes', () => {
      let yesBtn;

      beforeEach(() => {
        yesBtn = wrapper.find('button').filterWhere(el => el.text() === 'yes').first();
        yesBtn.simulate('click');
      });

      it('should have called the onClick Spy', () => {
        expect(onClickSpy).toHaveBeenCalled();
      });

      it('should hide the dialogue', () => {
        expect(wrapper.text()).toEqual('test');
      });
    });

    describe('confirming no', () => {
      let noBtn;
      beforeEach(() => {
        noBtn = wrapper.find('button').filterWhere(el => el.text() === 'no').first();
        noBtn.simulate('click');
      });


      it('should not have called the onClick Spy', () => {
        expect(onClickSpy).toNotHaveBeenCalled();
      });

      it('should hide the dialogue', () => {
        expect(wrapper.text()).toEqual('test');
      });
    });
  });

});
