/**
 * External dependencies
 */
import { CurrencyContext } from '@woocommerce/currency';
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { useProductHelper } from './use-product-helper';
import { formatCurrencyDisplayValue } from '../utils';

export type CurrencyInputProps = {
	prefix: string;
	className: string;
	value: string;
	sanitize: ( value: string | number ) => string;
	onChange: ( value: string ) => void;
	onFocus: ( event: React.FocusEvent< HTMLInputElement > ) => void;
	onKeyUp: ( event: React.KeyboardEvent< HTMLInputElement > ) => void;
};

type Props = {
	value: string;
	onChange: ( value: string ) => void;
	onFocus?: ( event: React.FocusEvent< HTMLInputElement > ) => void;
	onKeyUp?: ( event: React.KeyboardEvent< HTMLInputElement > ) => void;
};

export const useCurrencyInputProps = ( {
	value,
	onChange,
	onFocus,
	onKeyUp,
}: Props ) => {
	const { sanitizePrice } = useProductHelper();

	const context = useContext( CurrencyContext );
	const { getCurrencyConfig, formatAmount } = context;
	const currencyConfig = getCurrencyConfig();

	const currencyInputProps: CurrencyInputProps = {
		prefix: currencyConfig.symbol,
		className: 'components-currency-control',
		value: formatCurrencyDisplayValue(
			String( value ),
			currencyConfig,
			formatAmount
		),
		sanitize: ( val: string | number ) => {
			return sanitizePrice( String( val ) );
		},
		onFocus( event: React.FocusEvent< HTMLInputElement > ) {
			// In some browsers like safari .select() function inside
			// the onFocus event doesn't work as expected because it
			// conflicts with onClick the first time user click the
			// input. Using setTimeout defers the text selection and
			// avoid the unexpected behaviour.
			setTimeout(
				function deferSelection( element: HTMLInputElement ) {
					element.select();
				},
				0,
				event.currentTarget
			);
			if ( onFocus ) {
				onFocus( event );
			}
		},
		onKeyUp( event: React.KeyboardEvent< HTMLInputElement > ) {
			const amount = Number.parseFloat( sanitizePrice( value || '0' ) );
			const step = Number( event.currentTarget.step || '1' );
			if ( event.code === 'ArrowUp' ) {
				onChange( String( amount + step ) );
			}
			if ( event.code === 'ArrowDown' ) {
				onChange( String( amount - step ) );
			}
			if ( onKeyUp ) {
				onKeyUp( event );
			}
		},
		onChange( newValue: string ) {
			const sanitizeValue = sanitizePrice( newValue || '0' );
			if ( onChange ) {
				onChange( sanitizeValue );
			}
		},
	};
	return currencyInputProps;
};
