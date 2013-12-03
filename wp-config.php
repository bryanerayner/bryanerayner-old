<?php
/**
 * The base configurations of the WordPress.
 *
 * This file has the following configurations: MySQL settings, Table Prefix,
 * Secret Keys, WordPress Language, and ABSPATH. You can find more information
 * by visiting {@link http://codex.wordpress.org/Editing_wp-config.php Editing
 * wp-config.php} Codex page. You can get the MySQL settings from your web host.
 *
 * This file is used by the wp-config.php creation script during the
 * installation. You don't have to use the web site, you can just copy this file
 * to "wp-config.php" and fill in the values.
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'bryanera_wpdb01');



//For the local host
/// MySQL database username 
 define('DB_USER', 'root');

/// MySQL database password 
 define('DB_PASSWORD', '');


//For the server
/*// MySQL database username 
 define('DB_USER', 'bryanera_wpdb01');

//// MySQL database password 
 define('DB_PASSWORD', 'Sz094r1xeP');*/

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', '');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'q7vshhf6cbi3jzgnco5lhyapbl8wvb8k1mxzlzolvg3i78bxlfowkspvpmh3ogr1');
define('SECURE_AUTH_KEY',  'a1fqfxsnomfx4pokz75ladvtc1k4faxqqvdvrvghizcxnhtvphxnbp9rwrtfux8p');
define('LOGGED_IN_KEY',    'jht88r1txoxenlxo3kboghy7uzhlaldgnccres7fba1bmcmfpkhhnwadtciq7jol');
define('NONCE_KEY',        'yq1y4liprfpiwqrtkutsqj04bhib7aziqo0cycdty5t8pzynmnovtc6cxga2dafn');
define('AUTH_SALT',        '9jzj5wwyn0vs3kcs7ijpj2qa4kbzxb7xvwcbzd7bj4gwi680svhuqejeofnhwtix');
define('SECURE_AUTH_SALT', 'uft1pvfvklzz2crqrayxilfvmf7toxqr269evgos4rar0fphhsty6kuuv0f4zm0m');
define('LOGGED_IN_SALT',   'kvfdejwvrrukimhxftokc5j3iosfvgiepy1bxi13ax5efvpxponydkxbqqawi3xx');
define('NONCE_SALT',       'k7qhofpir4ugbtwxrx2jz1qgkcuv2qeio3bmc6a3qsqahbffudfneovqn3g2i9gc');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each a unique
 * prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * WordPress Localized Language, defaults to English.
 *
 * Change this to localize WordPress. A corresponding MO file for the chosen
 * language must be installed to wp-content/languages. For example, install
 * de_DE.mo to wp-content/languages and set WPLANG to 'de_DE' to enable German
 * language support.
 */
define('WPLANG', '');

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
