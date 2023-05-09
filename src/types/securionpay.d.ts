declare module 'securionpay' {
    /** Metadata
     * Most of updatable objects have metadata attribute that can be used to store custom pairs of key-value data.
     *
     * This is useful for storing additional structured information associated with given object. Example would be to save user login together with a customer object that represents that user.
     *
     * Each key must be unique within given metadata object. It is possible to store up to 255 characters in each key and each value.
     *
     * @see https://securionpay.com/docs/api#metadata
     */
    export type MetadataI = Record<string, unknown>;

    /**
     * CardId is a special id provided by securionpay with this format :
     * card_****************
     */
    export type CardId = string;

    export interface CardI {
        id: CardId;
        created: number;
        objectType: string;
        first6: string;
        last4: string;
        fingerprint: string;
        expMonth: string;
        expYear: string;
        cardholderName: string;
        customerId: string;
        brand: string;
        type: string;
        country: string;
    }

    /**
     * CustomerId is a special id provided by securionpay with this format :
     * cust_****************
     */
    export type CustomerId = string;

    export interface CustomerI {
        id: CustomerId;
        created: number;
        objectType: string;
        email: string;
        defaultCardId: string;
        cards: CardI[];
        metadata: MetadataI;
    }

    /** https://securionpay.com/docs/api#customer-create */
    interface CreateCustomerBody {
        email: string;
        description?: string;
        card?: string;
        metadata?: MetadataI;
    }
    /**
     * This is a type used to create a credit card object for securionpay
     * @see https://securionpay.com/docs/api#card-create
     */
    export interface CreateCardBody {
        /** Card number without any separators. */
        number: string;
        /** Card expiration month. */
        expMonth: string;
        /** Card expiration year. */
        expYear: string;
        /** Card security code. */
        cvc: string;

        cardholderName?: string;
        addressLine1?: string;
        addressLine2?: string;
        addressCity?: string;
        addressState?: string;
        addressZip?: string;
        /** Country represented as three-letter ISO country code. */
        addressCountry?: string;
        fraudCheckData?: {
            /** IP address of the user */
            ipAddress: string;
            /** e-mail address of the user */
            email: string;
            /** value of "User-Agent" HTTP header that was sent by the user */
            userAgent: string;
            /**  value of "Accept-Language" HTTP header that was sent by the user */
            acceptLanguage: string;
        };
    }

    export interface Address {
        /** address first line */
        line1: string;
        /** address second line */
        line2: string;
        /** ZIP (postal) code */
        zip: string;
        /** city or town */
        city: string;
        /** state or province */
        state: string;
        /** country represented as two-letter ISO country code */
        country: string;
    }

    /**
     * Body required for charging a user
     * @see https://securionpay.com/docs/api#charge-create
     */
    export interface CreateChargeBody {
        /**
         * Charge amount in minor units of given currency.
         *
         * For example 10€ is represented as "1000" and 10¥ is represented as "10".
         */
        amount: number;
        /**
         * Charge currency represented as three-letter ISO currency code.
         */
        currency: string;
        description?: string;
        /**
         * optional (either customerId or card is required)
         *
         * Identifier of customer that will be associated with this charge.
         *
         * This field is required if charge is being created with customer's existing card.
         *
         * If specified then successful charge created with new card will add that card to customer's cards and it will be set as customer's default card.
         */
        customerId?: string;
        /**
         * card token, card details or card identifier, optional (either customerId or card is required)
         *
         * Can be one of following:
         * - card token (for example obtained from custom form)
         * - card details (same as in card create request)
         * - card identifier (must be an existing card that is associated with customer specified in `customerId` field)
         *
         * If card is not provided then customer's default card will be used.
         */
        card?: string;
        /**
         * Whether this charge should be immediately captured.
         *
         * When set to false charge is only authorized (or pre-authorized) and needs to be captured later.
         * @default true
         */
        captured?: boolean;
        /**
         * Shipping details.
         */
        shipping?: {
            /** Name of the recipient */
            name: string;
            /** tax identification number */
            vat: string;
            address: Address;
        };
        /** Billing details */
        billing?: {
            /** Name of billed person or company */
            name: string;
            /** tax identification number */
            vat: string;
            address: Address;
        };
        /** 3D Secure options.  */
        threeDSecure?: {
            /**
             * The charge will fail when 3D Secure verification was not attempted
             * @default false
             */
            requireAttempt: boolean;
            /**
             *  The charge will fail if card doesn't support 3D Secure (is not enrolled for 3D Secure verification)
             * @default false
             */
            requireEnrolledCard: boolean;
            /**
             * The charge will fail when card supports 3D Secure verification, but that verification was not successful (i.e. customer cancelled the verification or provided invalid information in 3D Secure popup)
             * @default true
             */
            requireSuccessfulLiabilityShiftForEnrolledCard: boolean;

            /**
             * Used with external 3DS service.
             */
            external?: {
                /**  can have one of following values: 1.0.2, 2.1.0 and 2.2.0*/
                version: string;
                /**  Base64-encoded a 20 byte value*/
                xid?: string;
                /**  Electronic Commerce Indicator e.g. 05*/
                eci: string;
                /**  other names: CAVV, AAV, UCAF */
                authenticationValue?: string;
                /**
                 * dsTransID received in ARes
                 * - required for 3DS 2
                 */
                dsTransactionId?: string;
                /**
                 * acsTransID received in ARes
                 * - required for 3DS 2
                 */
                acsTransactionId?: string;
                /** can have one of following values: Y, N, A, U, R, E */
                status: string;
            };
        };

        metadata?: MetadataI;
    }

    export interface SecurionPayCharge {
        id: string;
        created: number;
        objectType: string;
        amount: number;
        currency: string;
        description: string;
        card: Card;
        captured: boolean;
        refunded: boolean;
        disputed: boolean;
    }

    interface SecurionPayCustomers {
        /**
         * Creates a new customer object.
         * @see https://securionpay.com/docs/api#customer-create
         */
        create: (data: CreateCustomerBody) => Promise<CustomerI>;
    }
    interface SecurionPayCards {
        /**
         * Creates a new card object.
         *
         * There are three ways to create a new card object:
         * - use card token (for example obtained from custom form)
         * - use charge identifier - will save card that was used to create charge (only possible for successful charge that is not assigned to any customer and will result in that charge being assigned to this customer)
         * - specify all card details (as seen in arguments list below)
         *
         *  @see https://securionpay.com/docs/api#card-create
         */
        create: (customerId: string, data: CreateCardBody) => Promise<CardI>;
        /**
         * Deletes an existing card object.
         *
         * If you delete card that is current default card then most recently added card will be used as new default card. If you delete last card then default card will be set to `null`.
         *
         * @see https://securionpay.com/docs/api#card-delete
         */
        delete: (customerId: string, cardId: string) => Promise<{ id: CardId }>;
    }

    interface SecurionPayCharges {
        create: (data: CreateChargeBody) => Promise<SecurionPayCharge>;
    }

    interface SecurionPayEndpoints {
        customers: SecurionPayCustomers;
        cards: SecurionPayCards;
        charges: SecurionPayCharges;
        [key: string]: any;
    }

    interface SecurionPay {
        (secretKey: string): SecurionPayEndpoints;
    }

    const SecurionPay: SecurionPay;
    export = SecurionPay;
}
