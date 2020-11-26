import { Piano } from 'react-piano';
import 'react-piano/dist/styles.css';
import DimensionsProvider from '../DimensionsProvider/DimensionsProvider';
import SoundfontProvider from '../SoundfontProvider/SoundfontProvider';

const soundfontHostname = 'https://d1pzp51pvbm36p.cloudfront.net';

function ResponsivePiano(props) {
  const { noteRange, handleGuess, activeNotes, audioContext } = props;
  return (
    <DimensionsProvider>
      {({ containerWidth, containerHeight }) => (
        <SoundfontProvider
          instrumentName="acoustic_grand_piano"
          audioContext={audioContext}
          hostname={soundfontHostname}
          handleGuess={handleGuess}
          render={({ isLoading, playNote, stopNote }) => (
            <Piano
              noteRange={noteRange}
              width={containerWidth}
              playNote={playNote}
              stopNote={stopNote}
              disabled={isLoading}
              activeNotes={activeNotes}
              {...props}
            />
          )}
        />
      )}
    </DimensionsProvider>
  );
}

export default ResponsivePiano;
