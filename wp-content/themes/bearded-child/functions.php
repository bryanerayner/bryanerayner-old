<?php 


	if (function_exists('register_sidebar'))
	{
		register_sidebar(array(
	'name'          => __( 'Services Sidebar' ),
	'id'            => 'services',
	'description'   => 'A sidebar for use in the Services page. Use it to lay out your content on the services page.',
        'class'         => 'services_sidebar',
	'before_widget' => '<div id="%1$s" class="widget %2$s">',
	'after_widget'  => '</div>',
	'before_title'  => '<h2 class="widgettitle">',
	'after_title'   => '</h2>' 
	));

	}



?>