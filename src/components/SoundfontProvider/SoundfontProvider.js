// See https://github.com/danigb/soundfont-player
// for more documentation on prop options.
import React from 'react';
import PropTypes from 'prop-types';
import Soundfont from 'soundfont-player';

const defaultProps = {
  format: 'mp3',
  soundfont: 'MusyngKite',
  instrumentName: 'acoustic_grand_piano',
};

export const playSingleNote = (audioContext, note) => {
  Soundfont.instrument(audioContext, defaultProps.instrumentName).then(function (piano) {
    piano.play(note);
  })
}

class SoundfontProvider extends React.Component {
  static propTypes = {
    instrumentName: PropTypes.string.isRequired,
    hostname: PropTypes.string.isRequired,
    format: PropTypes.oneOf(['mp3', 'ogg']),
    soundfont: PropTypes.oneOf(['MusyngKite', 'FluidR3_GM']),
    audioContext: PropTypes.instanceOf(window.AudioContext),
    render: PropTypes.func,
  };

  static defaultProps = defaultProps;

  constructor(props) {
    super(props);
    this.state = {
      activeAudioNodes: {},
      instrument: null,
    };
  }

  componentDidMount() {
    this.loadInstrument(this.props.instrumentName);
  }

  componentDidUpdate(prevProps, prevState) {
    const { instrumentName } = this.props;
    if (prevProps.instrumentName !== instrumentName) {
      this.loadInstrument(instrumentName);
    }
  }

  loadInstrument = instrumentName => {
    const { audioContext, soundfont, format, hostname } = this.props;
    // Re-trigger loading state
    this.setState({
      instrument: null,
    });
    Soundfont.instrument(audioContext, instrumentName, {
      format: format,
      soundfont: soundfont,
      nameToUrl: (name, soundfont, format) => {
        return `${hostname}/${soundfont}/${name}-${format}.js`;
      },
    }).then(instrument => {
      this.setState({
        instrument,
      });
    });
  };

  playNote = midiNumber => {
    const { instrument, activeAudioNodes } = this.state;
    const { handleGuess, audioContext } = this.props;
    handleGuess(midiNumber);
    audioContext.resume().then(() => {
      const audioNode = instrument.play(midiNumber);
      this.setState({
        activeAudioNodes: Object.assign({}, activeAudioNodes, {
          [midiNumber]: audioNode,
        }),
      });
    });
  };

  stopNote = midiNumber => {
    const { activeAudioNodes } = this.state;
    const { audioContext } = this.props;
    audioContext.resume().then(() => {
      if (!activeAudioNodes[midiNumber]) {
        return;
      }
      const audioNode = activeAudioNodes[midiNumber];
      audioNode.stop();
      this.setState({
        activeAudioNodes: Object.assign({}, activeAudioNodes, {
          [midiNumber]: null,
        }),
      });
    });
  };

  // Clear any residual notes that don't get called with stopNote
  stopAllNotes = () => {
    const { activeAudioNodes } = this.state;
    const { audioContext } = this.props;
    audioContext.resume().then(() => {
      const activeAudioNodes = Object.values(activeAudioNodes);
      activeAudioNodes.forEach(node => {
        if (node) {
          node.stop();
        }
      });
      this.setState({
        activeAudioNodes: {},
      });
    });
  };

  activeNotes = () => {
    return [60, 62, 64, 65, 67, 69, 71, 72]
  }

  render() {
    const { instrument } = this.state;
    return this.props.render({
      isLoading: !instrument,
      playNote: this.playNote,
      stopNote: this.stopNote,
      stopAllNotes: this.stopAllNotes,
      activeNotes: this.activeNotes()
    });
  }
}

export default SoundfontProvider;
