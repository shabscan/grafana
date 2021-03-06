import React from 'react';
import $ from 'jquery';
import coreModule from 'app/core/core_module';
import { GfColorPalette } from './ColorPalette';
import { GfSpectrumPicker } from './SpectrumPicker';

// Spectrum picker uses TinyColor and loads it as a global variable, so we can use it here also
declare var tinycolor;

export interface IProps {
  color: string;
  onColorSelect: (c: string) => void;
}

export class ColorPickerPopover extends React.Component<IProps, any> {
  pickerNavElem: any;

  constructor(props) {
    super(props);
    this.state = {
      tab: 'palette',
      color: this.props.color,
      colorString: this.props.color
    };
  }

  setPickerNavElem(elem) {
    this.pickerNavElem = $(elem);
  }

  setColor(color) {
    let newColor = tinycolor(color);
    if (newColor.isValid()) {
      this.setState({
        color: newColor.toString(),
        colorString: newColor.toString()
      });
      this.props.onColorSelect(color);
    }
  }

  sampleColorSelected(color) {
    this.setColor(color);
  }

  spectrumColorSelected(color) {
    let rgbColor = color.toRgbString();
    this.setColor(rgbColor);
  }

  onColorStringChange(e) {
    let colorString = e.target.value;
    this.setState({
      colorString: colorString
    });

    let newColor = tinycolor(colorString);
    if (newColor.isValid()) {
      // Update only color state
      this.setState({
        color: newColor.toString(),
      });
      this.props.onColorSelect(newColor);
    }
  }

  onColorStringBlur(e) {
    let colorString = e.target.value;
    this.setColor(colorString);
  }

  componentDidMount() {
    this.pickerNavElem.find('li:first').addClass('active');
    this.pickerNavElem.on('show', (e) => {
      // use href attr (#name => name)
      let tab = e.target.hash.slice(1);
      this.setState({
        tab: tab
      });
    });
  }

  render() {
    const paletteTab = (
      <div id="palette">
        <GfColorPalette color={this.state.color} onColorSelect={this.sampleColorSelected.bind(this)} />
      </div>
    );
    const spectrumTab = (
      <div id="spectrum">
        <GfSpectrumPicker color={this.props.color} onColorSelect={this.spectrumColorSelected.bind(this)} options={{}} />
      </div>
    );
    const currentTab = this.state.tab === 'palette' ? paletteTab : spectrumTab;

    return (
      <div className="gf-color-picker">
        <ul className="nav nav-tabs" id="colorpickernav" ref={this.setPickerNavElem.bind(this)}>
          <li className="gf-tabs-item-colorpicker">
            <a href="#palette" data-toggle="tab">Colors</a>
          </li>
          <li className="gf-tabs-item-colorpicker">
            <a href="#spectrum" data-toggle="tab">Custom</a>
          </li>
        </ul>
        <div className="gf-color-picker__body">
          {currentTab}
        </div>
        <div>
          <input className="gf-form-input gf-form-input--small" value={this.state.colorString}
            onChange={this.onColorStringChange.bind(this)} onBlur={this.onColorStringBlur.bind(this)}>
          </input>
        </div>
      </div>
    );
  }
}

coreModule.directive('gfColorPickerPopover', function (reactDirective) {
  return reactDirective(ColorPickerPopover, ['color', 'onColorSelect']);
});
