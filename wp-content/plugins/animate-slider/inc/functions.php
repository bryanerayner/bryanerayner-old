<?php

function as_get_prefix() {
	global $animateslider;

	if($animateslider) {
		return $animateslider->prefix;
	} else {
		return 'as';
	}

}
function as_get_meta( $post_id = '' ) {

	global $animateslider;

	if( empty($post_id) ) { return; }

	$supports = $animateslider->supports;
	$meta = array();
	$prefix = as_get_prefix();


	foreach( $supports as $support ) {

		if( $support == 'link') {
			$meta[$support] =  esc_url( get_post_meta( $post_id, "{$prefix}-{$support}", true ) );
		} else {
			$meta[$support] =  esc_attr( get_post_meta( $post_id, "{$prefix}-{$support}", true ) );
		}
	}

	return $meta;
}
