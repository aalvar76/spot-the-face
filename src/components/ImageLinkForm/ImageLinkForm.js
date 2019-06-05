import React from 'react';
import './imageLinkForm.css';

const ImageLinkForm = ({ onInputChange, onButtonSubmit}) => {
	return(
		<div className='ma4 mt0'>
			<p className='f3'>
				{'This Magic Brain will detect faces in your pictures.'}
			</p>
			<div className='center'>
				<div className='form center pa4 br3 shadow'>
					<input className='f4 pa2 w-70 center' type='text' onChange={onInputChange}/>
					<button className='w-30 grow f4 link ph3 pv2 dib blue bg-gold bn' onClick={onButtonSubmit}>Detect</button>
				</div>
			</div>
		</div>
		);
}

export default ImageLinkForm;